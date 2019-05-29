import React, { Component } from 'react';
import {RefreshControl,ImageBackground,Text, View, StyleSheet, TouchableOpacity, Image,ScrollView} from 'react-native';
import {connect} from 'react-redux';
import Title from "../../common/Title";
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import addBillPic from '../../../img/work/bill/addBill.png';
import nullDataPic from '../../../img/common/nullDataIcon.png';
import moment from "moment";
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";


class BillInfo extends BaseComponent {

    state = {
        billsData:[],
        refreshing:false
    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('我的帐单');
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        await this.getBillInfo();
    }

    getBillInfo = async () => {
        await this.showActivityIndicator();
        try{
            let billParams = await this.props.postAction(appJson.action.billFind,{pageSize:3,currentPage:1,sortName:'dates desc'},'查询账单');
            this.dealParam(billParams);

            this.hideActivityIndicator();
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    dealParam = (params) => {
        const {type,code,msg,data} = params;
        switch (type) {
            case appJson.action.billFind:
                if(code === appJson.action.success){
                    this.setState({billsData:data.list});
                }
                break;
        }
    }

    //去新增帐单界面
    _onAddBillBtn = () => {
        this.props.navigation.navigate('BillForm',{
            title:'添加帐单',
            callback:(data)=>{
                this.getBillInfo();
            }
        });
    }

    //去帐单历史记录界面
    _onBillsBtn = () => {
        if(this.state.billsData.length === 0){
            this.showToast('还没有记录哦');
            return;
        }
        this.props.navigation.navigate('Bills',{
            callback:(data)=>{
                this.getBillInfo();
            }});
    }

    //去帐单历史记录界面
    _onBillTotalBtn = () => {
        if(this.state.billsData.length === 0){
            this.showToast('还没有记录哦');
            return;
        }
        this.props.navigation.navigate('BillTotal',{
            callback:(data)=>{
            }
        });
    }

    _refresh = async () => {
        this.setState({refreshing:true});
        await this.getBillInfo();
        this.setState({refreshing:false});
    }

    render() {
        super.render();
        let view = (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._refresh}
                    />
                }
                style={{flex:1, margin:15}}
            >

                <Title text={'快捷功能'} style={{marginTop:0}}/>

                <View style={{flexDirection: 'row'}}>
                    {/*新增*/}
                    <Button onPress={this._onAddBillBtn}>
                        <ImageBackground style={styles.imgBg} source={addBillPic}>
                            <Text style={styles.font2}>新增一笔</Text>
                        </ImageBackground>
                    </Button>

                    <View style={{flex:1}}/>

                    {/*查找历史消费*/}
                    <Button onPress={this._onBillTotalBtn}>
                        <ImageBackground style={styles.imgBg} source={addBillPic}>
                            <Text style={styles.font2}>消费统计</Text>
                        </ImageBackground>
                    </Button>
                </View>

                {/*所有 本年 本月 当天 上一周 上一月 上一年*/}
                {/*总消费 总收入 总支出 平均值 最大 最小 */}
                {/**/}
                <Title text={'统计'}/>

                <View style={styles.info}>

                </View>

                <Title text={'消费记录'}/>

                {/*最近的记录*/}
                <Button onPress={this._onBillsBtn}>
                    {
                        this.state.billsData.length===0?(
                            <Image source={nullDataPic} style={{height:105,width:'100%'}} resizeMode={'contain'}/>
                        ):this.state.billsData.map((item,i)=>{
                            return(
                                <View key={i} style={[styles.itemView,{borderTopWidth:i===0?0:1}]}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        {/*分类名称*/}
                                        <Text style={{fontSize:15}}>
                                            {item.sortName}
                                        </Text>
                                        {/*分类金额*/}
                                        <Text style={{color:item.sums>0?'#f03':'#00cd00',fontSize:15}}>
                                            {item.sums>0?('+'+item.sums):item.sums}
                                        </Text>
                                    </View>

                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <Text style={{color:'#999',fontSize:12}}>
                                            来源:{item.methodName}
                                        </Text>
                                        <Text style={{color:'#999',fontSize:12}}>
                                            时间:{moment(item.dates).format("YYYY-MM-DD hh:mm:ss")}
                                        </Text>
                                    </View>
                                </View>
                            )
                        })
                    }

                </Button>
            </ScrollView>
        )

        return super.renderBase(view);
    }

}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        margin:15
    },
    info:{
        justifyContent:'space-between',
        height:75,
        backgroundColor:'#21c3ff',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:10,
    },
    imgBg:{
        width:150,
        height:150,
        justifyContent:'flex-end',
        alignItems:'center',
        paddingBottom: 10,
        borderRadius: 10
    },
    font2:{
        color:'#333',
        fontSize:19
    },
    itemView:{
        // flexDirection:'row',
        justifyContent:'space-around',
        //alignItems:'center',
        backgroundColor:'#fff',
        height:50,
        width:'100%',
        paddingHorizontal: 10,
        paddingVertical:2,
        borderTopColor:'#dcdcdc',
    }
});

export default connect(null,actions)(BillInfo);