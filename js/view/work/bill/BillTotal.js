import React, { Component } from 'react';
import {ScrollView, Text, View, StyleSheet, Platform,} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent';
import Title from "../../common/Title";
import BillTotalLabel from "./BillTotalLabel";
import Button from "../../common/Button";
import FilterTab from "../../common/FilterTab";
import DataBetween from "../../common/DataBetween";
import select from "../../../img/common/search_select.png";
import Echarts from 'native-echarts';

const filter = [
    {id:'lastDay',name:'上日'},
    {id:'currentWeek',name:'本周'},
    {id:'lastWeek',name:'上周'},
    {id:'currentMouth',name:'本月'},
    {id:'lastMouth',name:'上月'},
]
class BillTotal extends BaseComponent {

    state = {
        selectSort:[],
        selectMethod:[],
        selectLabel:[],
        filterValue:'lastDay',
        data:[],
    }

    // 构造
    constructor(props) {
        super(props);
        // this.setTitle('消费统计');
        this.props.navigation.setParams({rightView:this._renderRightView()});
        this.initOption();

    }

    initLabel = () => {
        this.type = null;
        this.sortName = 'dates desc';
        this.startTime = null;
        this.endTime = null;
        this.minSum = null;
        this.maxSum = null;
        this.methodId = null;
        this.sortId = null;
    }

    initOption = () => {

        this.xfjeLine = {
            title: {
                text: '世界人口总量',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                left:'right',
                data: ['2011年', '2012年']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: [0, 0.01],
                axisTick:{
                    show:false,
                },
                data: [
                    '08/1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',
                    '09/1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',
                    '10/月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',
                ]
            },
            yAxis: {
                type: 'value',
                axisTick:{
                    show:false,
                },

            },
            dataZoom: [
                // {
                //     type: 'slider',
                //     show: true,
                //     xAxisIndex: [0],
                //     start: 0,
                //     end: 100
                // },
                // {
                //     type: 'slider',
                //     show: true,
                //     yAxisIndex: [0],
                //     left: '93%',
                //     startValue: 0,
                //     end: 24
                // },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 12
                },
                // {
                //     type: 'inside',
                //     yAxisIndex: [0],
                //     startValue: 0,
                //     end: 24
                // }
            ],
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    barWidth:10,
                    data: [
                        182, 234, 290, 104, 131, 630,182, 234, 290, 104, 131, 630,
                        182, 234, 290, 104, 131, 630,182, 234, 290, 104, 131, 630,
                        182, 234, 290, 104, 131, 630,182, 234, 290, 104, 131, 630,
                    ]
                },
                {
                    name: '2012年',
                    type: 'bar',
                    barWidth:10,
                    data: [
                        193, 234, 310, 121, 141, 607,193, 234, 310, 121, 141, 607,
                        193, 234, 310, 121, 141, 607,193, 234, 310, 121, 141, 607,
                        193, 234, 310, 121, 141, 607,193, 234, 310, 121, 141, 607,
                    ]
                }
            ]
        };

        this.xfjePie = {
            title : {
                text: '某站点用户访问来源',
                // subtext: '纯属虚构',
                // x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '80%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    async componentDidMount(){
        super.componentDidMount();
        await this.initBase();
        this.setLockToLandscape();
        this.showActivityIndicator();
        try{
            //方式
            //分类
            const sortData = await this.props.postAction(appJson.action.billSortFind,{},'查询消费类别');
            this._dealParams(sortData);

            //方式
            const methodData = await this.props.postAction(appJson.action.billMethodFind,{},'查询消费方式');
            this._dealParams(methodData);

            this.hideActivityIndicator();
        }catch (e) {
            this.handleRequestError(e);
        }

    }

    _dealParams = (params:Object) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //消费类别
            case appJson.action.billSortFind:
                if(code === appJson.action.success){
                    if(data.totalCount >0){
                        this.setState({selectSort:data.list});
                    }
                }else{
                    this.handleRequestError(code,msg);
                }
                break;

            //消费方式
            case appJson.action.billMethodFind:
                let selectMethod = [];
                if(code === appJson.action.success){
                    data.list.map((item,i)=>selectMethod.push(item));
                    if(selectMethod.length >0){
                        this.setState({selectMethod:selectMethod});
                    }
                }else{
                    this.handleRequestError(code,msg);
                }

                break;

            default:
                this.hideActivityIndicator();
                break;

        }
    }

    _reset = async () => {
        this.initLabel();
        await this.setState({selectLabel:{sortName:'dates desc',type:'all',methodId在:'all',sortId:'all'}});
    }

    _submit = async (obj) => {
        await this.setState({selectLabel:obj});
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

    _onFilterItem = (item) => {
        this.setState({filterValue:item.id});
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
                    <DataBetween searchDate={()=>{}}/>

                    <FilterTab
                        data={filter}
                        value={this.state.filterValue}
                        onFilterItem={this._onFilterItem}
                    />
                </View>

                <View style={{marginHorizontal: 15,marginBottom: 15}}>
                    {/*折线 x:time  y:金额*/}
                    <View style={{backgroundColor:'#fff',padding: 5,marginTop:15,borderRadius: 10}}>
                        <Echarts height={180} option={this.xfjeLine}/>
                    </View>

                    {/*饼图*/}
                    <View style={{backgroundColor:'#fff',padding: 5,marginTop:15,borderRadius: 10}}>
                    <Echarts height={150} option={this.xfjePie}/>
                    </View>

                    <View style={{backgroundColor:'#fff',padding: 5,marginTop:15,borderRadius: 10}}>
                    <Echarts height={150} option={this.xfjePie}/>
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
                <Text style={{fontSize:18,color:'#00c2ff'}} source={select}>高级筛选</Text>
            </Button>
        )
    }

    //筛选条件
    renderLabel(){
        return (
            <BillTotalLabel
                method={this.state.selectMethod}
                sort={this.state.selectSort}
                hideModal={()=>this.initBase()}
                onSubmit={this._sumbit}
                onReset={this._reset}
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
        height:85,
        backgroundColor:'#fff',
        paddingHorizontal: 15,
        paddingVertical:5,
        borderRadius:10,
    },
    icon: {
        marginTop:10,
        width: 35,
        height: 28,
        resizeMode:'contain',

    },
});

export default connect(null,actions)(BillTotal);