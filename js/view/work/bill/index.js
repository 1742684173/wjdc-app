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
import MoreList from "../../common/MoreList";
import {numberFormatter} from "../../../utils/ToolUtil";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import test from '../../../test/img/index_icon_16.png'
import Divider from "../../common/Divider";

const billManager = [
    {route:'BillForm',name:'新增帐单',icon:test},
    {route:'BillTotal',name:'帐单统计',icon:test},
    {route:'BillHistory',name:'历史帐单',icon:test},
    {route:'BillData',name:'数据分析',icon:test},
    //{route:'AccountActivate',name:'导入支付宝数据',icon:test},
    //{route:'AccountActivate',name:'导入微信数据',icon:test},
];

class BillInfo extends BaseComponent {

    state = {
        billsHistory:[],
        billsData:[],
        billsTotal:[
        ],

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
        if(!this.state.refreshing){
            await this.showActivityIndicator();
        }

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
                    this.setState({billsHistory:data.list});
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

    _onPress = (item) => {
        this.props.navigation.navigate(item.route,{
            title:item.name,
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
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._refresh}
                    />
                }
                style={styles.contain}
            >

                <Title text={'帐单管理'} style={{marginTop:0}}/>
                {
                    this.renderView2(billManager)
                }


                <Title text={'最近记录'}/>

                {/*最近的记录*/}
                {
                    this.state.billsHistory.length===0?(
                        <Image source={nullDataPic} style={{height:pxTodpHeight(110),width:'100%'}} resizeMode={'contain'}/>
                    ):this.state.billsHistory.map((item,i)=>{
                        return(
                            <View key={i} style={[styles.itemView,{borderTopWidth:i===0?0:1}]}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    {/*分类名称*/}
                                    <Text style={{fontSize:pxTodpWidth(30)}}>
                                        {item.sortName}
                                    </Text>
                                    {/*分类金额*/}
                                    <Text style={{color:item.type === 1?'#f03':'#00cd00',fontSize:pxTodpWidth(30)}}>
                                        {item.type === 1?('+'+item.sums):('-'+item.sums)}
                                    </Text>
                                </View>

                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={{color:'#999',fontSize:pxTodpWidth(24)}}>
                                        来源:{item.methodName}
                                    </Text>
                                    <Text style={{color:'#999',fontSize:pxTodpWidth(24)}}>
                                        时间:{moment(item.dates).format("YYYY-MM-DD hh:mm:ss")}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }


                {/*所有 本年 本月 当天 上一周 上一月 上一年*/}
                {/**/}
                <Title text={'最新指标'}/>

                <View style={{height:pxTodpHeight(320)}}>
                    <MoreList
                        onEndReached={()=>{}}
                        onRefresh={()=>{}}
                        isShowActivityIndicator={false}
                        headerHeight={pxTodpHeight(60)}
                        leftWidth={pxTodpWidth(160)}
                        leftTitle={[
                            {key:'time',value:'时间'},
                        ]}
                        rightTitle={[
                            {key:'sumValue',value:'总额'},
                            {key:'incomeValue',value:'总收入'},
                            {key:'expendValue',value:'总支出'},
                            {key:'modeValue',value:'众数'},
                            {key:'maxValue',value:'最大'},
                            {key:'minValue',value:'最小'},
                            {key:'avgValue',value:'日平均值'},
                            {key:'countValue',value:'消费次数'},
                            {key:'countAvgValue',value:'次平均值'},
                        ]}
                        data={[
                            {
                                time:'今日',sumValue:'1231',incomeValue:'341',expendValue:'2342',avgValue:'141',
                                modeValue:'214',maxValue:'123',minValue:'123'
                            },
                            {
                                time:'本周',sumValue:'1231',incomeValue:'341',expendValue:'2342',avgValue:'141',
                                modeValue:'214',maxValue:'123',minValue:'123'
                            },
                            {
                                time:'本月',sumValue:'1231',incomeValue:'341',expendValue:'2342',avgValue:'141',
                                modeValue:'214',maxValue:'123',minValue:'123'
                            },
                        ]}
                        itemHeadView={
                            (item)=>{
                                return(
                                    <Button key={item.key} style={[styles.itemSty,{backgroundColor:'#c3eeff',borderRadius:0}]}>
                                        <Text style={[styles.itemFont,{color:'#333',}]}>{item.value}</Text>
                                    </Button>
                                )
                            }
                        }
                        itemLeftView={
                            (item,index)=>{
                                return(
                                    <View key={index} style={[styles.itemSty,{backgroundColor:index%2===0?'#fff':'#E6F8FF'}]}>
                                        <Text style={styles.itemFont}>{item.time}</Text>
                                    </View>
                                )
                            }
                        }
                        itemRightView={
                            (item,index)=>{
                                return(
                                    <View key={index} style={{flexDirection:'row',backgroundColor:index%2===0?'#fff':'#E6F8FF'}}>
                                        <View style={styles.itemSty}>
                                            <Text style={styles.itemFont}>{numberFormatter(item.sumValue)}</Text>
                                        </View>
                                        <View style={styles.itemSty}>
                                            <Text style={[styles.itemFont,{color:'#f03'}]}>{numberFormatter(item.incomeValue)}</Text>
                                        </View>
                                        <View style={styles.itemSty}>
                                            <Text style={[styles.itemFont,{color:'#00cd00'}]}>{numberFormatter(item.expendValue)}</Text>
                                        </View>
                                        <View style={styles.itemSty}>
                                            <Text style={styles.itemFont}>{numberFormatter(item.avgValue)}</Text>
                                        </View>
                                        <View style={styles.itemSty}>
                                            <Text style={styles.itemFont}>{numberFormatter(item.modeValue)}</Text>
                                        </View>
                                        <View style={styles.itemSty}>
                                            <Text style={styles.itemFont}>{numberFormatter(item.maxValue)}</Text>
                                        </View>
                                        <View style={styles.itemSty}>
                                            <Text style={styles.itemFont}>{numberFormatter(item.minValue)}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        }
                    />
                </View>

            </ScrollView>
        )

        return super.renderBase(view);
    }

    renderView2(array){
        let views = [];
        for(let i=0;i<array.length;i+=2){
            let view = (
                <View key={i} style={{flexDirection:'row',}}>
                    <Button
                        onPress={()=>this._onPress(array[i])}
                        style={[styles.btnTopItem,{
                            borderBottomLeftRadius: i < array.length-(array.length%2===0?2:1)?0:22,
                            borderTopLeftRadius: i > 0?0:22,
                        }]}
                    >
                        <Image source={array[i].icon} style={{width:pxTodpWidth(50)}} resizeMode={'center'}/>
                        <Text style={{color:'#666', fontSize:pxTodpWidth(30), marginLeft:pxTodpWidth(20)}}>
                            {array[i].name}
                        </Text>
                    </Button>

                    <Divider style={{width:0.5,height:pxTodpHeight(80)}}/>

                    <Button
                        onPress={()=>this._onPress(array[i+1])}
                        style={[styles.btnTopItem,{
                            borderBottomRightRadius: i < array.length-(array.length%2===0?2:1)?0:22,
                            borderTopRightRadius: i > 0?0:22,
                        }]}
                    >
                        <Image source={array[i+1].icon} style={{width:pxTodpWidth(50)}} resizeMode={'center'}/>
                        <Text style={{color:'#666', fontSize:pxTodpWidth(30), marginLeft:pxTodpWidth(20)}}>
                            {array[i+1].name}
                        </Text>
                    </Button>
                </View>
            );
            views.push(<Divider key={array[i].name}/>);
            views.push(view);
        }
        return views;
    }
}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        marginHorizontal: pxTodpWidth(30),
        marginVertical: pxTodpHeight(30)
    },
    info:{
        justifyContent:'space-between',
        height:pxTodpHeight(150),
        backgroundColor:'#fff',
        paddingHorizontal:pxTodpWidth(20),
        paddingVertical:pxTodpHeight(10),
        borderRadius:pxTodpWidth(20),
    },
    imgBg:{
        width:pxTodpWidth(300),
        height:pxTodpHeight(300),
        justifyContent:'flex-end',
        alignItems:'center',
        paddingBottom: pxTodpHeight(20),
        borderRadius: pxTodpWidth(20)
    },
    font2:{
        color:'#333',
        fontSize:pxTodpWidth(38)
    },
    itemView:{
        // flexDirection:'row',
        justifyContent:'space-around',
        //alignItems:'center',
        backgroundColor:'#fff',
        height:pxTodpHeight(100),
        width:'100%',
        paddingHorizontal: pxTodpWidth(20),
        paddingVertical:pxTodpHeight(4),
        borderTopColor:'#dcdcdc',
    },
    sjzbSty:{
        width:pxTodpWidth(160),
        height:pxTodpHeight(60),
        justifyContent:'flex-start',
        alignItems: 'center'
    },
    sjzbFontSty:{
        fontSize:pxTodpWidth(30)
    },
    itemSty:{
        height:pxTodpHeight(60),
        width:pxTodpWidth(160),
        justifyContent:'center',
        alignItems:'center'
    },
    itemFont:{
        fontSize:pxTodpWidth(30),
        color:'#666'
    },
    btnTopItem:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        // alignItems:'center',
        backgroundColor:'#fff',
        borderRadius:0,
        paddingHorizontal:pxTodpWidth(20)
    },
    div1:{
        width:undefined,
        height:pxTodpHeight(80),
        paddingLeft:pxTodpWidth(30),
        justifyContent:'center',
        backgroundColor:'#fff',
        borderTopRightRadius:pxTodpWidth(20),
        borderTopLeftRadius:pxTodpWidth(20),
    }
});

export default connect(null,actions)(BillInfo);