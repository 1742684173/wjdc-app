import React, { Component } from 'react';
import {Text, ScrollView,View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import Field from '../../common/Field';
import TextField from '../../common/TextField';
import DateTimeField from '../../common/DateTimeField';
import RadioButton from '../../common/RadioButton';
import TextArea from '../../common/TextArea';
import Button from '../../common/Button';
import Select from '../../common/Select';
import * as appJson from '../../../../app';
import * as actions from '../../../actions/index';
import moment from "moment";
import BaseComponent from "../../base/BaseComponent";

const selectType = [{id:-1,value:'支出'},{id:1,value:'收入'}];
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
            const sortData = await this.props.postAction(appJson.action.billSortFind,{},'查询消费类别');
            this._dealParams(sortData);

            //方式
            const methodData = await this.props.postAction(appJson.action.billMethodFind,{},'查询消费方式');
            this._dealParams(methodData);

            //帐单
            const billData = !!!this.id?null:await this.props.postAction(appJson.action.billFind,{id:this.id},'查询消费');
            billData===null?null:this._dealParams(billData);

            this.hideActivityIndicator()
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //刷新消费分类
    _onRefreshSort = async () => {
        this.showActivityIndicator();
        try{
            //分类
            const sortData = await this.props.postAction(appJson.action.billSortFind,{},'查询消费类别');
            this.hideActivityIndicator();
            this._dealParams(sortData);
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //消费消费方式
    _onRefreshMethod = async () => {
        this.showActivityIndicator();
        try{
            //方式
            const methodData = await this.props.postAction(appJson.action.billMethodFind,{},'查询消费方式');
            this.hideActivityIndicator();
            this._dealParams(methodData);
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //处理返回请求结果
    _dealParams = (params:Object,isHideActivityIndicator?:boolean) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //消费类别
            case appJson.action.billSortFind:
                if(code === appJson.action.success){
                    if(data.totalCount > 0){
                        this.setState({selectSort:data.list});
                    }
                }
                break;

            //消费方式
            case appJson.action.billMethodFind:
                if(code === appJson.action.success){
                    if(data.totalCount > 0){
                        this.setState({selectMethod:data.list});
                    }
                }
                break;

            //修改帐单时查询帐单信息
            case appJson.action.billFind:
                if(code === appJson.action.success){
                    if(data.total > 0){
                        this.props.initialize(data.list[0]);
                    }
                }
                break;

            //通过id删除消费方式
            case appJson.action.billMethodDeleteById:
                if(code === appJson.action.success){
                    this.showToast(msg);
                    this._onRefreshMethod();
                }
                break;

            //通过id删除消费方式
            case appJson.action.billSortDeleteById:
                if(code === appJson.action.success){
                    this.showToast(msg);
                    this._onRefreshSort();
                }
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
                await this.props.postAction(appJson.action.billAdd,object,'添加帐单','form');
            this.hideActivityIndicator();

            if(type === appJson.action.billAdd){
                if(code === appJson.action.success){
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
                                        type:selectType[0].id
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
                    this.toast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //增加分类
    _addSortBtn = () => {
        this.props.navigation.navigate('BillSortForm',{
            title:'添加消费分类',
            func:appJson.action.billSortAdd,
            callback:this._onRefreshSort
        });
    }

    //增加方式
    _addMethodBtn = () => {
        this.props.navigation.navigate('BillMethodForm',{
            title:'添加消费方式',
            func:appJson.action.billMethodAdd,
            callback:this._onRefreshMethod
        });
    }

    //编辑方式
    _editMethodBtn = (item) =>{
        this.props.navigation.navigate('BillMethodForm',{
            title:'编辑消费方式',
            item,
            func:appJson.action.billMethodUpdateById,
            callback:this._onRefreshMethod
        });
    }

    //编辑分类
    _editSortBtn = (item) =>{
        this.props.navigation.navigate('BillSortForm',{
            title:'编辑消费分类',
            item,
            func:appJson.action.billSortUpdateById,
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
            const methodData = await this.props.postAction(appJson.action.billMethodDeleteById,{id:id},'通过id删除消费方式');
            this.hideActivityIndicator();
            this._dealParams(methodData);
        }catch (e) {
            this.handleRequestError(e);
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
            const methodData = await this.props.postAction(appJson.action.billSortDeleteById,{id:id},'通过id删除消费方式');
            this.hideActivityIndicator();
            this._dealParams(methodData);
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    render() {
        super.render();
        let view = (
            <ScrollView style={styles.contain} keyboardShouldPersistTaps={'handled'}>

                <View style={{height:12}}/>
                <Field name={'type'} component={RadioButton} title={'消费类型'} isNeed={true}
                       values={selectType} defaultValue={selectType[0].id}
                />

                <Field name={'dates'} component={DateTimeField}
                       mode={'datetime'} title={'消费时间'} isNeed={true}
                       defaultValue={new Date()}
                />

                <View style={{height:5}}/>

                <Field name={'sums'} component={TextField}
                       title={'消费金额'} isNeed={true} keyboardType={'numeric'}
                />

                <View style={{height:95}}/>
                <Field name={'descs'} component={TextArea}
                       title={'消费描述'} isNeed={false} height={100}
                />

                <View style={{height:50}}/>
                <Button style={{height:39,backgroundColor:'#21c3ff',}} onPress={this.props.handleSubmit(this._addBill)}>
                    <Text style={styles.btnSubmit}>提交</Text>
                </Button>

                <View style={{width:'100%',position:'absolute',top:185}}>
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

                <View style={{width:'100%',position:'absolute',top:140}}>
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
        paddingHorizontal: 15,
    },
    btnSubmit:{
        fontSize:20,
        color:'#fff'
    },
});

const ReduxBillForm = reduxForm({
    form: 'BillForm',
})(BillForm)

export default connect(null,actions)(ReduxBillForm);
