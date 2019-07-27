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
import {daysReduce, formatDate, formatDateToWeek, numberFormatter} from "../../../utils/ToolUtil";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import test from '../../../test/img/index_icon_16.png'
import Divider from "../../common/Divider";
import {
    getCurrentMonthEndDate,
    getCurrentMonthStartDate,
    getCurrentWeekEndDate, getCurrentWeekStartDate, getCurrentYearEndDate, getCurrentYearStartDate,
    getLastWeekStartDate,
    getTodayEndDate,
    getTodayStartDate
} from "../../../utils/DateUtil";

const billManager = [
    {route:'BillAddForm',name:'新增帐单',icon:test},
    {route:'BillAnalyse',name:'数据分析',icon:test},
    {route:'BillSort',name:'分类管理',icon:test},
    {route:'BillLabel',name:'标签管理',icon:test},
    //{route:'AccountActivate',name:'导入支付宝数据',icon:test},
    //{route:'AccountActivate',name:'导入微信数据',icon:test},
];
const totalTitle = [
    {key:'time',name:'时间'},
    {key:'iValue',name:'收入'},
    {key:'eValue',name:'支出'},
    {key:'dValue',name:'差值'}
];

class BillInfo extends BaseComponent {

    state = {
        billsHistory:[],
        billsTotal:[],
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

            const currentDay = await this.props.postAction(appJson.action.totalBillByType, {
                startTime:getTodayStartDate(),endTime:getTodayEndDate()
            },'今日统计');
            this.dealParam(currentDay,1);

            const currentWeek = await this.props.postAction(appJson.action.totalBillByType,{
                startTime:getCurrentWeekStartDate(),endTime:getCurrentWeekEndDate()
            },'本周统计');
            this.dealParam(currentWeek,2);

            const currentMouth = await this.props.postAction(appJson.action.totalBillByType,{
                startTime:getCurrentMonthStartDate(),endTime:getCurrentMonthEndDate()
            },'本月统计');
            this.dealParam(currentMouth,3);

            const currentYear = await this.props.postAction(appJson.action.totalBillByType,{
                startTime:getCurrentYearStartDate(),endTime:getCurrentYearEndDate()
            },'本年统计');
            this.dealParam(currentYear,4);

            this.hideActivityIndicator();


        }catch (e) {
            this.handleRequestError(e);
        }
    }

    dealParam = (params,flag) => {
        const {type,code,msg,data} = params;
        switch (type) {
            case appJson.action.billFind:
                if(code === appJson.action.success){
                    this.setState({billsHistory:data.list});
                }
                break;

            case appJson.action.totalBillByType:
                if(code === appJson.action.success){
                    if(flag === 1) this.billsTotal = [];
                    let eValue = 0,iValue = 0;
                    let myTime = ['今日','本周','本月','本年'];
                    for(let i=0;i<data.list.length;i++){
                        if(data.list[i].name === '支出'){
                            eValue = data.list[i].value;
                        }else{
                            iValue = data.list[i].value;
                        }
                    }
                    this.billsTotal.push({
                        time:myTime[flag - 1],
                        eValue:eValue,
                        iValue:iValue,
                        dValue:iValue-eValue,
                    });
                    if(flag === 4){
                        this.setState({billsTotal:this.billsTotal});
                    }
                }
                break;
        }
    }

    _onPress = (item) => {
        this.props.navigation.navigate(item.route,{
            callback:(data)=>{
                if(item.route === 'BillAddForm'){
                    this.getBillInfo();
                }
            }
        });
    }

    _goBillHistory = () => {
        if(this.state.billsHistory.length===0){
            this.showToast('记录为空');
            return;
        }

        this.props.navigation.navigate('BillHistory',{
            callback:(data)=>{
                this.getBillInfo();
            }
        });
    }

    _goBillTotal = () => {
        this.props.navigation.navigate('BillTotal',{
            callback:(data)=>{
                this.getBillInfo();
            }
        });
    }

    _refresh = async () => {
        await this.setState({refreshing:true});
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


                <Title text={'历史记录'}/>

                {/*最近的记录*/}
                <Button onPress={this._goBillHistory} style={{flexDirection: 'column',}}>
                    {
                        this.state.billsHistory.length===0?(
                            <Image source={nullDataPic} style={{height:pxTodpHeight(110),width:'100%'}} resizeMode={'contain'}/>
                        ):this.state.billsHistory.map((item,i)=>{
                            return(
                                <View key={i} style={[styles.itemView,{borderTopWidth:i===0?0:1}]}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        {/*分类名称*/}
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{fontSize:pxTodpWidth(30)}}>
                                            {item.sortName}
                                            <Text style={{color:'#999',fontSize:pxTodpWidth(24)}}>({
                                                    formatDateToWeek(formatDate(item.dates,"YYYY-MM-DD"))+' '
                                                    +formatDate(item.dates,"HH:mm:ss")
                                            })</Text>
                                        </Text>
                                        {/*分类金额*/}
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{textAlign:'right',color:item.type === 1?'#f03':'#00cd00',fontSize:pxTodpWidth(30)}}>
                                            {item.type === 1?('+'+item.sums):('-'+item.sums)}
                                        </Text>
                                    </View>

                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{flex:1,color:'#999',fontSize:pxTodpWidth(24)}}>
                                            描述:{item.descs}
                                        </Text>
                                        {
                                            item.labelName?(
                                                <Text ellipsizeMode={'tail'}  numberOfLines={1} style={{flex:1,textAlign:'right',color:'#999',fontSize:pxTodpWidth(24)}}>
                                                    标签：{item.labelName}
                                                </Text>
                                            ):null
                                        }

                                    </View>
                                </View>
                            )
                        })
                    }
                </Button>

                {/*所有 本年 本月 当天 上一周 上一月 上一年*/}
                <Title text={'数据统计'}/>

                <Button
                    style={{flexDirection:'column'}}
                    onPress={this._goBillTotal}
                >
                    <View style={styles.bottomTitleSty}>
                        {
                            totalTitle.map((item,index)=>{
                                return (
                                    <View key={index} style={[styles.itemSty,{flex:1,backgroundColor:'#c3eeff'}]}>
                                        <Text style={[styles.itemFont,{color:'#333',}]}>{item.name}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>

                    {
                        this.state.billsTotal.map((item,i)=>{
                            return (
                                <View key={i} style={{flexDirection:'row',backgroundColor:i%2===0?'#fff':'#E6F8FF'}}>
                                    {
                                        totalTitle.map((itemTitle,index)=>{
                                            return (
                                                <View key={index} style={[styles.itemSty,{flex:1}]}>
                                                    <Text style={[styles.itemFont,itemTitle.key === 'dValue'?{color:item[itemTitle.key]>0?'#f03':'#00cd00'}:null]}>{
                                                        itemTitle.key === 'time'?item[itemTitle.key]:
                                                            numberFormatter(Math.floor(item[itemTitle.key]))
                                                    }</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            )
                        })
                    }
                </Button>

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
    },
    bottomTitleSty:{
        flexDirection:'row',
        borderTopRightRadius:pxTodpWidth(20),
        borderTopLeftRadius:pxTodpWidth(20)
    }
});

export default connect(null,actions)(BillInfo);