import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler, Platform, Image,} from 'react-native';
import {connect} from 'react-redux';
import * as config from '../../../config';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent';
import Title from "../../../common/Title";
import BillTotalLabel from "./BillTotalLabel";
import Button from "../../../common/Button";
import FilterTab from "../../../common/FilterTab";
import select from "../../../img/common/search_select.png";
import {getLineOption,getPieOption} from "../../../common/Echarts";

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
        this.setTitle('消费统计');
        this.props.navigation.setParams({rightView:this._renderRightView()});
    }

    initLabel = () => {
        this.type = null;
        this.sortName = 'dates desc';
        this.startTime = null;
        this.endTime = null;
        this.minSum = null;
        this.maxSum = null;
        this.method = null;
        this.sort = null;
    }

    async componentDidMount(){
        await this.initBase();
        this.showActivityIndicator();
        try{
            //方式
            //分类
            const sortData = await this.props.postAction(config.BILL_SORT_FIND,{},'查询消费类别');
            this._dealParams(sortData);

            //方式
            const methodData = await this.props.postAction(config.BILL_METHOD_FIND,{},'查询消费方式');
            this._dealParams(methodData);

            this._dealParams({});
        }catch (e) {
            this.showToast(JSON.stringify(e));
        }

    }

    _dealParams = (params:Object) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //消费类别
            case config.BILL_SORT_FIND:
                if(code === config.CODE_SUCCESS){
                    if(data.totalCount >0){
                        this.setState({selectSort:data.list});
                    }
                }else{
                    this.handleRequestError(code,msg);
                }
                break;

            //消费方式
            case config.BILL_METHOD_FIND:
                let selectMethod = [];
                if(code === config.CODE_SUCCESS){
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
        await this.setState({selectLabel:{sortName:'dates desc',type:'all',method:'all',sort:'all'}});
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
            <View style={styles.contain}>

                <FilterTab data={filter} value={this.state.filterValue} onFilterItem={this._onFilterItem}
                           style={{paddingHorizontal: 15}}/>

                <Title text={'消费金额'} style={{marginTop:10,marginBottom:5}}/>
                {/*折线 x:time  y:金额*/}


                <Title text={'消费方式'} style={{marginTop:10,marginBottom:5}}/>
                {/*饼图*/}
                <View style={styles.homeCustomPieView}>
                    {/*<Echarts option={this.state.khsPie} height={pxTodpHeight(286)}/>*/}
                </View>

                <Title text={'消费分类'} style={{marginTop:10,marginBottom:5}}/>
                {/*饼图*/}
            </View>
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
        backgroundColor:'#f2f2f2',
    },
    button: {
        backgroundColor: 'transparent',
    },
    icon: {
        marginTop:10,
        width: 35,
        height: 28,
        resizeMode:'contain',

    },
});

export default connect(null,actions)(BillTotal);