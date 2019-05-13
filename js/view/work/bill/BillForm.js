import React, { Component } from 'react';
import {Text, ScrollView,View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import Field from '../../../common/Field';
import TextField from '../../../common/TextField';
import DateTimeField from '../../../common/DateTimeField';
import RadioButton from '../../../common/RadioButton';
import TextArea from '../../../common/TextArea';
import Button from '../../../common/Button';
import Select from '../../../common/Select';
import * as config from '../../../config';
import * as actions from '../../../actions/index';
import moment from "moment";
import BaseComponent from "../../base/BaseComponent";

const selectType = [{key:'out',value:'支出'},{key:'in',value:'收入'}];
class BillForm extends BaseComponent {

    state = {
        selectSort:[],
        selectMethod:[],
    }

    // 构造
    constructor(props) {
        super(props);
        this.id = this.props.navigation.state.params.id;
        this.setTitle(this.id?'修改帐单':'增加帐单');
    }

    componentDidMount = async () => {
        await this.initBase();
        this._getBillInfo();
    }

    //获取
    _getBillInfo = async() => {
        this.showActivityIndicator();

        try{

            //分类
            const sortData = await this.props.postAction(config.BILL_SORT_FIND,{},'查询消费类别');
            this._dealParams(sortData);

            //方式
            const methodData = await this.props.postAction(config.BILL_METHOD_FIND,{},'查询消费方式');
            this._dealParams(methodData);

            //帐单
            const billData = !!!this.id?null:await this.props.postAction(config.BILL_FIND,{id:this.id},'查询消费');
            billData===null?null:this._dealParams(billData);

            this.hideActivityIndicator();

        }catch (e) {
            this.showToast(e.message || e.note);
        }
    }

    //刷新消费分类
    _onRefreshSort = async () => {
        this.showActivityIndicator();
        try{
            //分类
            const sortData = await this.props.postAction(config.BILL_SORT_FIND,{pageSize:1000},'查询消费类别');
            this.hideActivityIndicator();
            this._dealParams(sortData);
        }catch (e) {
            this.showToast(e.message || e.note);
        }
    }

    //消费消费方式
    _onRefreshMethod = async () => {
        this.showActivityIndicator();
        try{
            //方式
            const methodData = await this.props.postAction(config.BILL_METHOD_FIND,{pageSize:1000},'查询消费方式');
            this.hideActivityIndicator();
            this._dealParams(methodData);
        }catch (e) {
            this.showToast(e.message || e.note);
        }
    }

    //处理返回请求结果
    _dealParams = (params:Object) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //消费类别
            case config.BILL_SORT_FIND:
                let selectSort = [];
                if(code === config.CODE_SUCCESS){
                    data.list.map((item,i)=>selectSort.push(item));
                    if(selectSort.length >0){
                        this.setState({selectSort:selectSort});
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

            //修改帐单时查询帐单信息
            case config.BILL_FIND:
                if(code === config.CODE_SUCCESS){
                    if(data.total > 0){
                        this.props.initialize(data.list[0]);
                    }else{
                        this.showToast('帐单数据为空');
                    }
                }else{
                    this.handleRequestError(code,msg);
                }
                break;

            //通过id删除消费方式
            case config.BILL_METHOD_DELETE_BY_ID:
                if(code === config.CODE_SUCCESS){
                    this.showToast(msg);
                    this._onRefreshMethod();
                }else{
                    this.handleRequestError(code,msg);
                }
                break;

            //通过id删除消费方式
            case config.BILL_SORT_DELETE_BY_ID:
                if(code === config.CODE_SUCCESS){
                    this.showToast(msg);
                    this._onRefreshSort();
                }else{
                    this.handleRequestError(code,msg);
                }
                break;

            default:
                break;

        }
    }

    //添加
    _addBill = async (object:Object) => {

        const {methodId,dates,sums,sortId,type} = object;
        if(sums === undefined || sums === null || sums.length === 0){
            this.showToast('请输入消费金额');
            return;
        }

        if(methodId === undefined || methodId === null || methodId.length === 0){
            this.showToast('请选择消费方式');
            return;
        }

        if(sortId === undefined || sortId === null || sortId.length === 0){
            this.showToast('请选择消费分类');
            return;
        }

        this.showActivityIndicator();
        try{
            const {type,code,msg} =
                await this.props.postAction(config.BILL_ADD,Object.assign(object,{sums:object.type==='in'?sums:-1*sums}),'添加帐单','form');

            if(type === config.BILL_ADD){
                if(code === config.CODE_SUCCESS){
                    this.showAlert({
                        content:'添加成功,是否继续？',
                        buttons:[
                            {
                                text:'是',
                                onPress:()=>{
                                    this.hideActivityIndicator();
                                    this.props.initialize({
                                        methodId:this.state.selectMethod.length>0?this.state.selectMethod[0].id:null,
                                        sortId:this.state.selectSort.length>0?this.state.selectSort[0].id:null,
                                        dates:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                                        type:this.props.sums===1?selectType[0].key:selectType[1].key
                                    });
                                }
                            },
                            {
                                text:'否',
                                onPress:()=>{
                                    this.props.navigation.state.params.callback({});
                                    this.props.navigation.goBack();
                                }
                            }
                        ]
                    });

                }else{
                    this.handleRequestError(code,msg);
                }
            }
        }catch (e) {
            this.showToast(e.message||'未知错误');
        }
    }

    //增加分类
    _addSortBtn = () => {
        this.props.navigation.navigate('BillSortForm',{
            title:'添加消费分类',
            func:config.BILL_SORT_ADD,
            callback:this._onRefreshSort
        });
    }

    //增加方式
    _addMethodBtn = () => {
        this.props.navigation.navigate('BillMethodForm',{
            title:'添加消费方式',
            func:config.BILL_METHOD_ADD,
            callback:this._onRefreshMethod
        });
    }

    //编辑方式
    _editMethodBtn = (item) =>{
        this.props.navigation.navigate('BillMethodForm',{
            title:'编辑消费方式',
            item,
            func:config.BILL_METHOD_UPDATE_BY_ID,
            callback:this._onRefreshMethod
        });
    }

    //编辑分类
    _editSortBtn = (item) =>{
        this.props.navigation.navigate('BillSortForm',{
            title:'编辑消费分类',
            item,
            func:config.BILL_SORT_UPDATE_BY_ID,
            callback:this._onRefreshSort
        });
    }

    _cancelDelete = () => {
        this.hideActivityIndicator();
    }

    //提示是否通过id删除消费方式
    _deleteMethodBtn = (item) => {
        this.showAlert({
            content:'确认删除【'+item.name+'】?',
            buttons:[
                {
                    text:'确认',
                    onPress:()=>this._confirmDeleteMethod(item.id)
                },
                {
                    text:'取消',
                    onPress:this._cancelDelete
                }
            ]
        });
    }

    //确认删除消费方式
    _confirmDeleteMethod = async (id:number) => {
        this.showActivityIndicator();
        try{
            //方式
            const methodData = await this.props.postAction(config.BILL_METHOD_DELETE_BY_ID,{id:id},'通过id删除消费方式');
            this._dealParams(methodData);
        }catch (e) {
            this.showToast(e.message || e.note);
        }
    }

    //提示是否通过id删除消费类别
    _deleteSortBtn = (item) => {
        this.showAlert({
            content:'确认删除【'+item.name+'】?',
            buttons:[
                {
                    text:'确认',
                    onPress:()=>this._confirmDeleteSort(item.id)
                },
                {
                    text:'取消',
                    onPress:this._cancelDelete
                }
            ]
        });
    }

    //确认删除消费类别
    _confirmDeleteSort = async (id:number) => {
        this.showActivityIndicator();
        try{
            //方式
            const methodData = await this.props.postAction(config.BILL_SORT_DELETE_BY_ID,{id:id},'通过id删除消费方式');
            this._dealParams(methodData);
        }catch (e) {
            this.showToast(e.message || e.note);
        }
    }

    render() {
        super.render();
        let view = (
            <ScrollView style={styles.contain} keyboardShouldPersistTaps={'handled'}>

                <View style={{height:pxTodpHeight(24)}}/>
                <Field name={'type'} component={RadioButton} title={'消费类型'} isNeed={true}
                       values={selectType} defaultValue={selectType[0].key}
                />

                <Field name={'dates'} component={DateTimeField}
                       mode={'datetime'} title={'消费时间'} isNeed={true}
                       defaultValue={new Date()}
                />

                <View style={{height:pxTodpHeight(10)}}/>

                <Field name={'sums'} component={TextField}
                       title={'消费金额'} isNeed={true} keyboardType={'numeric'}
                />

                <View style={{height:pxTodpHeight(190)}}/>
                <Field name={'descs'} component={TextArea}
                       title={'消费描述'} isNeed={false} height={pxTodpHeight(200)}
                />

                <View style={{height:pxTodpHeight(100)}}/>
                <Button style={{height:pxTodpHeight(78)}} onPress={this.props.handleSubmit(this._addBill)}>
                    <Text style={styles.btnSubmit}>提交</Text>
                </Button>

                <View style={{position:'absolute',top:pxTodpHeight(370)}}>
                    <Field
                        name={'sortId'} component={Select} title={'消费分类'} isNeed={true}
                        values={this.state.selectSort}
                        isShowAdd={true}
                        addBtn={this._addSortBtn}
                        isShowEdit={true}
                        editBtn={this._editSortBtn}
                        isShowDelete={true}
                        deleteBtn={this._deleteSortBtn}
                    />
                </View>

                <View style={{position:'absolute',top:pxTodpHeight(280)}}>
                    <Field
                        name={'methodId'} component={Select} title={'消费方式'} isNeed={true}
                        values={this.state.selectMethod}
                        isShowAdd={true}
                        addBtn={this._addMethodBtn}
                        isShowEdit={true}
                        editBtn={this._editMethodBtn}
                        isShowDelete={true}
                        deleteBtn={this._deleteMethodBtn}
                    />
                </View>



            </ScrollView>
        );

        return super.renderBase(view);
    }

}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#fff',
        paddingHorizontal: pxTodpWidth(30),
    },
    btnSubmit:{
        fontSize:pxTodpWidth(40),
        color:'#fff'
    },
});

const ReduxBillForm = reduxForm({
    form: 'BillForm',
})(BillForm)

export default connect(null,actions)(ReduxBillForm);
