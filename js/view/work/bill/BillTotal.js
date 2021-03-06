import React, { Component } from 'react';
import {ScrollView, Text, View, StyleSheet, Platform,} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent';
import Title from "../../common/Title";
import BillTotalLabel from "./common/TotalLabel";
import Button from "../../common/Button";
import FilterTab from "../../common/FilterTab";
import DateBetween from "../../common/DateBetween";
import select from "../../../img/common/search_select.png";
import Echarts from 'native-echarts';
import EchartsUtil from '../../../utils/EchartsUtil';
import moment from "moment";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import {
    getCurrentMonthEndDate,
    getCurrentMonthStartDate, getCurrentQuarterEndDate, getCurrentQuarterStartDate,
    getCurrentWeekEndDate,
    getCurrentWeekStartDate, getLastMonthEndDate, getLastMonthStartDate,
    getLastWeekEndDate,
    getLastWeekStartDate, getTodayEndDate, getTodayStartDate, getYesterdayEndDate, getYesterdayStartDate
} from "../../../utils/DateUtil";

let echartsUtil = new EchartsUtil();

const filter = [
    {id:'currentDay',name:'当日',startTime:getTodayStartDate(),endTime:getTodayEndDate()},
    {id:'lastDay',name:'上日',startTime:getYesterdayStartDate(),endTime:getYesterdayEndDate()},
    {id:'currentWeek',name:'本周',startTime:getCurrentWeekStartDate(),endTime:getCurrentWeekEndDate()},
    {id:'lastWeek',name:'上周',startTime: getLastWeekStartDate(),endTime:getLastWeekEndDate()},
    {id:'currentMouth',name:'本月',startTime:getCurrentMonthStartDate(),endTime:getCurrentMonthEndDate()},
    {id:'lastMouth',name:'上月',startTime:getLastMonthStartDate(),endTime:getLastMonthEndDate()},
    {id:'currentQuarter',name:'本季度',startTime:getCurrentQuarterStartDate(),endTime:getCurrentQuarterEndDate()},
    // {id:'lastQuarter',name:'上季度'},
    // {id:'currentYear',name:'本年'},
    // {id:'lastYear',name:'上一年'},
];


class BillTotal extends BaseComponent {

    state = {
        filterValue:'currentDay',
        sort:[],
        label:[],
        selectLabel: {
            type:'all',
            labelId:'all',
            sortId:'all',
            dateformat:'%Y-%m-%d',
        },
        //starDate:moment(new Date()).format('YYYY-MM-DD')+' 00:00:00',//开始时间
        //endDate:moment(new Date()).format('YYYY-MM-DD')+' 24:00:00',//结束时间
        dataByDates:echartsUtil.init().getOption(),
        dataBySort:echartsUtil.init().getOption(),
        dataByType:echartsUtil.init().getOption(),
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('数据统计');
        this.props.navigation.setParams({rightView:this._renderRightView()});

    }

    initLabel = () => {
        this.type = null;
        this.startTime = getTodayStartDate();
        this.endTime = getTodayEndDate();
        this.labelId = null;
        this.sortId = null;
        this.dateformat = '%Y-%m-%d';
    }

    async componentDidMount(){
        super.componentDidMount();
        await this.initBase();
        await this.initLabel();
        this.showActivityIndicator();
        try{
            //分类
            const sortData = await this.props.postAction(appJson.action.billSortFind,{},'查询类别');
            this._dealParams(sortData);

            //方式
            const labelData = await this.props.postAction(appJson.action.billLabelFind,{},'查询标签');
            this._dealParams(labelData);

            await this._totalData();

            this.hideActivityIndicator();
        }catch (e) {
            this.handleRequestError(e);
        }

    }

    _totalData = async () => {
        this.showActivityIndicator();
        let obj = {
            type:this.type,
            startTime:this.startTime,
            endTime:this.endTime,
            labelId:this.labelId,
            sortId:this.sortId,
            dateformat:this.dateformat,
        };
        try{
            //通过时间统计
            const billDataByDates = await this.props.postAction(appJson.action.totalBillByDates,obj,'通过时间统计帐单');
            this._dealParams(billDataByDates);

            //通过分类统计
            const billDataBySort = await this.props.postAction(appJson.action.totalBillBySort,obj,'通过分类统计');
            this._dealParams(billDataBySort);

            //通过类型统计
            const billDataByType = await this.props.postAction(appJson.action.totalBillByType,obj,'通过类型统计');
            this._dealParams(billDataByType);
            this.hideActivityIndicator();
        }catch (e) {
            console.log(e);
            this.handleRequestError(e);
        }
    }

    _dealParams = (params:Object) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //类别
            case appJson.action.billSortFind:
                if(code === appJson.action.success){
                    if(data.totalCount >0){
                        this.setState({sort:data.list});
                    }
                }
                break;

            //标签
            case appJson.action.billLabelFind:
                if(code === appJson.action.success){
                    if(data.totalCount >0){
                        this.setState({label:data.list});
                    }
                }

                break;

            //通过时间统计帐单
            case appJson.action.totalBillByDates:

                let billByDateSR = [],billByDateZC=[],X=[];
                if(code === appJson.action.success){
                    data.list.map((item,i)=>{
                        item.type === -1 ?billByDateZC.push(item.sums):billByDateSR.push(item.sums);
                        if(!X.includes(item.dates)){
                            X.push(item.dates);
                        }
                    });
                    console.log('X--->'+JSON.stringify(X));
                    let dataByDates = echartsUtil.init().setTitle('金额')
                        .setLegendData(['支出(元)','收入(元)'])
                        .setXAxisData(X).setSeries([
                            {
                                name: '支出(元)',
                                type: 'bar',
                                barWidth:pxTodpWidth(20),
                                //barCateGoryGap:pxTodpWidth(20),//条间距离
                                data: billByDateZC,
                                itemStyle:{
                                    normal:{
                                        barBorderRadius:[5,5,0,0],
                                    },

                                }
                            },
                            {
                                name: '收入(元)',
                                type: 'bar',
                                barWidth:pxTodpWidth(20),
                                data: billByDateSR,
                                itemStyle:{
                                    normal:{
                                        barBorderRadius:[5,5,0,0],
                                    },

                                }
                            }
                        ]).setColor(['#00cd00','#f03']).getOption();
                    this.setState({dataByDates:dataByDates});
                }
                break;

            //通过分类统计帐单
            case appJson.action.totalBillBySort:
                if(code === appJson.action.success){
                    let dataBySort = echartsUtil.init().setTitle('分类比例')
                        .setTooltip({trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"})
                        .setDataZoom(null)
                        .setXAxis(null)
                        .setYAxis(null)
                        .setSeries([
                            {
                                name:'分类',
                                type: 'pie',
                                radius : '50%',
                                center: ['50%', '60%'],
                                data:data.list,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}:{c} ({d}%)',
                                    }
                                },
                            }
                        ]).getOption();
                    this.setState({dataBySort:dataBySort})
                }
                break;

            //通过类型统计帐单
            case appJson.action.totalBillByType:
                if(code === appJson.action.success){
                    let dataByType = echartsUtil.init().setTitle('收入与支出比例')
                        .setTooltip({trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"})
                        .setDataZoom(null)
                        .setXAxis(null)
                        .setYAxis(null)
                        .setSeries([
                            {
                                name:'收入与支出',
                                type: 'pie',
                                radius : '50%',
                                center: ['50%', '60%'],
                                data:data.list,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}:{c} ({d}%)',
                                       }
                                },
                            }
                        ]).getOption();
                    this.setState({dataByType:dataByType})
                }
                break;

            default:
                this.hideActivityIndicator();
                break;

        }
    }

    _onReset = async () => {
        this.initLabel();
        await this.setState({
            selectLabel: {
                type:'all',
                labelId:'all',
                sortId:'all',
                dateformat:'%Y-%m-%d'
            }
        });
    }

    _onSumbit = async (obj) => {

        this.type = obj.type === 'all'?null:obj.type;
        this.labelId = obj.labelId === 'all'?null:obj.labelId;
        this.sortId = obj.sortId === 'all'?null:obj.sortId;
        this.dateformat = obj.dateformat;

        await this.setState({selectLabel:obj});
        await this._totalData();
    }

    // 筛选
    _onSelectBtn = async () => {

        await this.setState({
            dialogType:'others',//load alert others
            isDialogVisible:true,//是否显示加载框
            dialogContent:this.renderLabel(),//当dialogType为alert时是字符串，当是others时是相关控件
            dialogOnRequestClose:()=>{},//modal返回监听
            dialogOnShowClose:()=>{}//modal显示之前调用
        });
    }

    _onFilterItem = async (item) => {
        this.refs.dateBetween.clear();
        await this.setState({filterValue:item.id});
        this.startTime = item.startTime;
        this.endTime = item.endTime;

        await this._totalData();
    }

    //搜索
    _onSearchDate = async (startTime,endTime) => {
        await this.setState({filterValue:null});
        this.startTime = startTime+' 00:00:00';
        this.endTime = endTime+' 23:59:59';
        this.filteTime = null;

        await this._totalData();
    }

    render() {
        super.render();
        let view = (
            <ScrollView
                stickyHeaderIndices={[0]}
                style={styles.contain}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >

                <View style={styles.dates}>
                    <DateBetween ref={'dateBetween'} searchDate={this._onSearchDate}/>

                    <FilterTab
                        data={filter}
                        value={this.state.filterValue}
                        onFilterItem={this._onFilterItem}
                    />
                </View>

                <View style={{marginHorizontal: pxTodpWidth(30),marginBottom: pxTodpHeight(30)}}>
                    {/*折线 x:time  y:金额*/}
                    <View style={styles.echartSty}>
                        <Echarts height={pxTodpHeight(300)} option={this.state.dataByDates}/>
                    </View>

                    {/*饼图*/}
                    <View style={styles.echartSty}>
                        <Echarts height={pxTodpHeight(300)} option={this.state.dataBySort}/>
                    </View>

                    <View style={styles.echartSty}>
                        <Echarts height={pxTodpHeight(300)} option={this.state.dataByType}/>
                    </View>
                </View>
            </ScrollView>
        )

        return super.renderBase(view);
    }

    //右上筛选按钮
    _renderRightView = () => {
        return (
            <Button style={[styles.button, Platform.OS==='android'? {paddingTop:0}: ""]}
                    onPress={this._onSelectBtn}>
                <Text style={{fontSize:pxTodpWidth(36),color:'#00c2ff'}} source={select}>高级筛选</Text>
            </Button>
        )
    }

    //筛选条件
    renderLabel(){
        return (
            <BillTotalLabel
                selectLabel={this.state.selectLabel}
                label={this.state.label}
                sort={this.state.sort}
                hideModal={()=>this.hideActivityIndicator()}
                onSubmit={this._onSumbit}
                onReset={this._onReset}
                onRequestClose={()=>this.initBase()}
                selectLabel={this.state.selectLabel}
            />
        )
    }

}

const styles = StyleSheet.create({
    contain:{
        flex:1,
    },
    button: {
        backgroundColor: 'transparent',
    },
    dates:{
        width:undefined,
        height:pxTodpHeight(170),
        backgroundColor:'#fff',
        paddingHorizontal: pxTodpWidth(30),
        paddingVertical:pxTodpHeight(10),
        borderRadius:pxTodpWidth(20),
    },
    icon: {
        marginTop:pxTodpHeight(20),
        width: pxTodpWidth(70),
        height: pxTodpHeight(58),
        resizeMode:'contain',

    },
    echartSty:{
        backgroundColor:'#fff',
        paddingVertical:pxTodpHeight(10),
        paddingHorizontal:pxTodpWidth(10),
        marginTop:pxTodpHeight(16),
        borderRadius: pxTodpWidth(20)
    }
});

export default connect(null,actions)(BillTotal);