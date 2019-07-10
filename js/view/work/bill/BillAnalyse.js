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
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";

const analyseTitle = [
    {key:'incomeValue',name:'总收入'},
    {key:'expendValue',name:'总支出'},
    {key:'maxValue',name:'最大'},
    {key:'minValue',name:'最小'},
    {key:'countValue',name:'消费次数'},
    {key:'countAvg',name:'次平均值'},
    {key:'dayAvg',name:'日平均值'},
    {key:'weekAvg',name:'周平均值'},
    {key:'mouthAvg',name:'月平均值'},
    {key:'quarterAvg',name:'季平均值'},
    {key:'yearAvg',name:'年平均值'},
];

const filter = [
    {id:'currenDay',name:'当日'},
    {id:'lastDay',name:'上日'},
    {id:'currentWeek',name:'本周'},
    {id:'lastWeek',name:'上周'},
    {id:'currentMouth',name:'本月'},
    {id:'lastMouth',name:'上月'},
    {id:'currentQuarter',name:'本季度'},
    {id:'lastQuarter',name:'上季度'},
    {id:'currentYear',name:'本年'},
    {id:'lastYear',name:'上一年'},
];


class BillAnalyse extends BaseComponent {

    state = {
        selectSort:[],
        selectLabels:[],
        selectLabel: {
            type:'all',
            labelId:'all',
            sortId:'all',
            dateformat:'%Y-%m-%d',
        },
        filterValue:'currenDay',
        data:{
            sumValue:'1231',incomeValue:'341',expendValue:'2342',avgValue:'141',
            modeValue:'214',maxValue:'123',minValue:'123'
        },
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('数据分析');
        this.props.navigation.setParams({rightView:this._renderRightView()});

    }

    initLabel = () => {
        this.type = null;
        this.startTime = null;
        this.endTime = null;
        this.filteTime = 'currenDay';
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
            const sortData = await this.props.postAction(appJson.action.billSortFind,{},'查询消费类别');
            this._dealParams(sortData);

            //方式
            const labelData = await this.props.postAction(appJson.action.billLabelFind,{},'查询消费方式');
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
            filteTime:this.filteTime,
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
            //消费类别
            case appJson.action.billSortFind:
                if(code === appJson.action.success){
                    if(data.totalCount >0){
                        this.setState({selectSort:data.list});
                    }
                }
                break;

            //消费方式
            case appJson.action.billLabelFind:
                let selectLabel = [];
                if(code === appJson.action.success){
                    data.list.map((item,i)=>selectLabel.push(item));
                    if(selectLabel.length >0){
                        this.setState({selectLabel:selectLabel});
                    }
                }

                break;

            //通过时间统计帐单
            case appJson.action.totalBillByDates:

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
        this.filteTime = item.id;

        await this._totalData();
    }

    //搜索
    _onSearchDate = async (startTime,endTime) => {
        await this.setState({filterValue:null});
        this.startTime = startTime;
        this.endTime = endTime;
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

                <View style={{
                    marginVertical:pxTodpHeight(20),
                    marginHorizontal: pxTodpWidth(30),
                    backgroundColor:'#fff',
                    borderRadius: pxTodpWidth(20),
                    paddingHorizontal: pxTodpWidth(10),
                    paddingVertical: pxTodpHeight(10)
                }}>
                    {
                        analyseTitle.map((item,i)=>{
                            return (
                                <View key={i} style={styles.itemView}>
                                    <Text style={styles.textName}>{item.name}:</Text>
                                    <Text style={styles.textValue}>{this.state.data[item.key]}</Text>
                                </View>
                            )
                        })
                    }
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
                label={this.state.selectLabel}
                sort={this.state.selectSort}
                hideModal={()=>this.initBase()}
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
    itemView:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor:"#dcdcdc",
        paddingBottom: pxTodpHeight(6),
        marginTop:pxTodpHeight(30)
    },
    textName:{
        fontSize:pxTodpWidth(28),
        color:'#666666',
    },
    textValue:{
        fontSize:pxTodpWidth(28),
        color:'#333',
    },
});

export default connect(null,actions)(BillAnalyse);