import React, { Component } from 'react';
import {Text, ScrollView,View, StyleSheet, } from 'react-native';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import Field from '../../common/Field';
import TextField from '../../common/TextField';
import DateTimeField from '../../common/DateTimeField';
import RadioButton from '../../common/RadioButton';
import TextArea from '../../common/TextArea';
import Button from '../../common/Button';
import SelectField from '../../common/SelectField';
import * as appJson from '../../../../app';
import * as actions from '../../../actions/index';
import moment from "moment";
import BaseComponent from "../../base/BaseComponent";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";

const selectType = [{id:-1,value:'支出'},{id:1,value:'收入'}];
class BillForm extends BaseComponent {

    state = {
        selectSort:[],
        sortParentValues:[{id:0,name:'一级目录'}],
        selectLabel:[],
    }

    // 构造
    constructor(props) {
        super(props);
        this.title = this.props.navigation.state.params.title;
        this.data = this.props.navigation.state.params.data;
        this.setTitle(this.title);

        this.data?this.props.initialize({
            id:this.data.id+'',
            sums:this.data.sums+'',
            type:this.data.type+'',
            dates:this.data.dates+'',
            labelId:this.data.labelId+'',
            sortId:this.data.sortId+'',
            descs:this.data.descs+'',
        }):null
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        this._getBillInfo();
    }

    //获取
    _getBillInfo = async() => {
        this.showActivityIndicator();

        try{
            //分类
            const sortData = await this.props.postAction(
                appJson.action.billSortFind,
                {parentId:this.state.sortParentValues[this.state.sortParentValues.length-1].id},
                '查询类别'
            );
            this._dealParams(sortData);

            //方式
            const LabelData = await this.props.postAction(appJson.action.billLabelFind,{},'查询方式');
            this._dealParams(LabelData);

            //帐单
            const billData = !!!this.id?null:await this.props.postAction(appJson.action.billFind,{id:this.id},'查询');
            billData===null?null:this._dealParams(billData);

            this.hideActivityIndicator()
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //查询分类
    _getBillSort = async () => {
        this.showActivityIndicator();

        try{
            //分类
            const sortData = await this.props.postAction(
                appJson.action.billSortFind,
                {parentId:this.state.sortParentValues[this.state.sortParentValues.length-1].id},
                '查询类别'
            );
            this._dealParams(sortData);

            this.hideActivityIndicator()
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //查询标签
    _getBillLabel = async () => {
        this.showActivityIndicator();
        try{
            //方式
            const labelData = await this.props.postAction(appJson.action.billLabelFind,{},'查询标签');
            this.hideActivityIndicator();
            this._dealParams(labelData);
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //处理返回请求结果
    _dealParams = (params:Object,isHideActivityIndicator?:boolean) => {
        let {type,code,msg,data} = params;
        switch (type) {
            //类别
            case appJson.action.billSortFind:
                if(code === appJson.action.success){
                    this.setState({selectSort:data.list});
                }
                break;

            //方式
            case appJson.action.billLabelFind:
                if(code === appJson.action.success){
                    this.setState({selectLabel:data.list});
                }
                break;

            //修改帐单时查询帐单信息
            case appJson.action.billFind:
                if(code === appJson.action.success){
                    this.props.initialize(data.list[0]);
                }
                break;

            //通过id删除标签
            case appJson.action.billLabelDeleteById:
                if(code === appJson.action.success){
                    this._getBillLabel();
                }else {
                    this.showToast(msg);
                }
                break;

            //通过id删除分类
            case appJson.action.billSortDeleteById:
                if(code === appJson.action.success){
                    this._getBillSort();
                }else {
                    this.showToast(msg);
                }
                break;

        }
    }

    //添加
    _addBill = async (object:Object) => {

        const {LabelId,dates,sums,sortId,type} = object;
        if(sums === undefined || sums === null || sums.length === 0){
            this.showToast('请输入金额');
            return;
        }

        if(sortId === undefined || sortId === null || sortId.length === 0){
            this.showToast('请选择分类');
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
                                        LabelId:this.state.selectLabel.length>0?this.state.selectLabel[0].id:null,
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

    //编辑
    _editBill = async (object:Object) => {

        const {LabelId,dates,sums,sortId,type} = object;
        if(sums === undefined || sums === null || sums.length === 0){
            this.showToast('请输入金额');
            return;
        }

        if(sortId === undefined || sortId === null || sortId.length === 0){
            this.showToast('请选择分类');
            return;
        }

        this.showActivityIndicator();
        try{
            const {type,code,msg} =
                await this.props.postAction(appJson.action.billUpdateById,object,'编辑帐单','form');
            this.hideActivityIndicator();

            if(type === appJson.action.billUpdateById){
                if(code === appJson.action.success){
                    this.showAlert({
                        content:'编辑成功',
                        buttons:[
                            {
                                text:'是',
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
            title:'添加分类',
            parentId:this.sortParentId,
            func:appJson.action.billSortAdd,
            callback:this._getBillSort
        });
    }

    //增加方式
    _addLabelBtn = () => {
        this.props.navigation.navigate('BillLabelForm',{
            title:'添加方式',
            func:appJson.action.billLabelAdd,
            callback:this._getBillLabel
        });
    }

    //编辑方式
    _editLabelBtn = (item) =>{
        this.props.navigation.navigate('BillLabelForm',{
            title:'编辑方式',
            item,
            func:appJson.action.billLabelUpdateById,
            callback:this._getBillLabel
        });
    }

    //编辑分类
    _editSortBtn = (item) =>{
        this.props.navigation.navigate('BillSortForm',{
            title:'编辑分类',
            item,
            func:appJson.action.billSortUpdateById,
            callback:this._getBillSort
        });
    }

    _cancelDelete = () => {
        this.hideActivityIndicator();
    }

    //提示是否通过id删除方式
    _deleteLabelBtn = (item) => {
        this.showAlert({
            content:'确认删除【'+item.name+'】?',
            buttons:[
                {
                    text:'确认',
                    onPress:()=>this._confirmDeleteLabel(item.id)
                },
                {
                    text:'取消',
                    onPress:this._cancelDelete
                }
            ]
        });
    }

    //确认删除方式
    _confirmDeleteLabel = async (id:number) => {
        this.showActivityIndicator();
        try{
            //方式
            const data = await this.props.postAction(appJson.action.billLabelDeleteById,{id:id},'通过id删除方式');
            this.hideActivityIndicator();
            this._dealParams(data);
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //提示是否通过id删除类别
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

    //确认删除类别
    _confirmDeleteSort = async (id:number) => {
        this.showActivityIndicator();
        try{
            //方式
            const data = await this.props.postAction(appJson.action.billSortDeleteById,{id:id},'通过id删除方式');
            this.hideActivityIndicator();
            this._dealParams(data);
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    _onParentSortItem = async (obj) => {
        let parentValues = this.state.sortParentValues;
        // if(parentValues[parentValues.length-1].id === obj.id){
        //     return;
        // }

        let result = [];
        for(let i=0;i<parentValues.length;i++){
            result.push(parentValues[i]);
            if(parentValues[i].id === obj.id){
                break;
            }
        }
        await this.setState({sortParentValues:result});

        this.sortParentId = obj.id;
        this._getBillSort();
    }

    _onItemSortPress = async (obj) => {
        let parentValues = this.state.sortParentValues;
        parentValues.push(obj);
        await this.setState({sortParentValues:parentValues});

        this.sortParentId = obj.id;
        this._getBillSort();
    }

    render() {
        super.render();
        let view = (
            <ScrollView contentContainerStyle={styles.contain} keyboardShouldPersistTaps={'handled'}>

                <View style={{height:pxTodpHeight(24)}}/>
                <Field name={'type'} component={RadioButton} title={'类型'} isNeed={true}
                       values={selectType} defaultValue={this.data?this.data.type:selectType[0].id}
                />

                <Field name={'dates'} component={DateTimeField}
                       mode={'datetime'} title={'时间'} isNeed={true}
                       defaultValue={this.data?this.data.dates:new Date()}
                />

                <View style={{height:pxTodpHeight(10)}}/>

                <Field name={'sums'} component={TextField}
                       title={'金额'} isNeed={true} keyboardType={'numeric'}
                />

                <View style={{height:pxTodpHeight(10)}}/>

                <Field
                    name={'sortId'} component={SelectField} title={'分类'} isNeed={true}
                    values={this.state.selectSort}
                    isShowAdd={true}
                    addBtn={this._addSortBtn}
                    isShowDelete={false}
                    deleteBtn={this._deleteSortBtn}
                    defaultValue={this.data?this.data.sortId:null}
                    isParent={true}
                    parentValues={this.state.sortParentValues}
                    onParentItem={this._onParentSortItem}
                    onItemPress={this._onItemSortPress}
                />

                <View style={{height:pxTodpHeight(10)}}/>

                <Field
                    isNeed={true}
                    name={'labelId'} component={SelectField} title={'标签'}
                    values={this.state.selectLabel}
                    isShowAdd={true}
                    addBtn={this._addLabelBtn}
                    isShowEdit={true}
                    editBtn={this._editLabelBtn}
                    isShowDelete={true}
                    deleteBtn={this._deleteLabelBtn}
                    defaultValue={this.data?this.data.labelId:null}
                />

                <View style={{height:pxTodpHeight(10)}}/>

                <Field name={'descs'} component={TextArea}
                       title={'描述'} isNeed={false} height={100}
                />

                <View style={{height:pxTodpHeight(100)}}/>
                <Button
                    style={{height:pxTodpHeight(78),backgroundColor:'#21c3ff',}}
                    onPress={this.props.handleSubmit(this.data?this._editBill:this._addBill)}
                >
                    <Text style={styles.btnSubmit}>提交</Text>
                </Button>

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
