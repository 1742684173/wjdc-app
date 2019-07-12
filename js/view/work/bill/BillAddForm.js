import React, { Component } from 'react';
import {KeyboardAvoidingView,Text, ScrollView,View, StyleSheet, } from 'react-native';
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
import * as actions from '../../../actions';
import moment from "moment";
import BaseComponent from "../../base/BaseComponent";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import managerImg from '../../../img/common/manager.png';

const selectType = [{id:-1,name:'支出'},{id:1,name:'收入'}];
class BillAddForm extends BaseComponent {

    state = {
        selectSort:[],
        selectLabel:[],
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('新增帐单');
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
            const sortData = await this.props.postAction(appJson.action.billSortFind, {}, '查询类别');
            this._dealParams(sortData);

            //方式
            const LabelData = await this.props.postAction(appJson.action.billLabelFind,{},'查询方式');
            this._dealParams(LabelData);


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
            const sortData = await this.props.postAction(appJson.action.billSortFind, {}, '查询类别');
            this.hideActivityIndicator()

            this._dealParams(sortData);
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
                                        sortId:this.state.selectSort.length>0?this.state.selectSort[0].id:null,
                                        dates:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
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
        this.props.navigation.navigate('BillSort',{
            callback:this._getBillSort
        });
    }

    //增加方式
    _addLabelBtn = () => {
        this.props.navigation.navigate('BillLabel',{
            callback:this._getBillLabel
        });
    }

    render() {
        super.render();
        let view = (
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.contain}>

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
                    addImg={managerImg}
                    defaultValue={this.data?this.data.sortId:null}
                    onItemPress={this._onItemSortPress}
                />

                <View style={{height:pxTodpHeight(10)}}/>

                <Field
                    isNeed={false}
                    name={'labelId'} component={SelectField} title={'标签'}
                    values={this.state.selectLabel}
                    isShowAdd={true}
                    addBtn={this._addLabelBtn}
                    addImg={managerImg}
                    isShowEdit={true}
                    editBtn={this._editLabelBtn}
                    defaultValue={this.data?this.data.labelId:null}
                />

                <View style={{height:pxTodpHeight(10)}}/>
                <Field name={'descs'} component={TextArea} title={'描述'} isNeed={false} height={100}/>

                <View style={{height:pxTodpHeight(100)}}/>
                <Button
                    style={{height:pxTodpHeight(78),backgroundColor:'#21c3ff',}}
                    onPress={this.props.handleSubmit(this._addBill)}
                >
                    <Text style={styles.btnSubmit}>提交</Text>
                </Button>

                <View style={{height:200}}/>
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

const ReduxBillAddForm = reduxForm({
    form: 'BillAddForm',
})(BillAddForm)

export default connect(null,actions)(ReduxBillAddForm);
