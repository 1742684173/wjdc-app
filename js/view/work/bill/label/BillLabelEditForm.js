import React, { Component } from 'react';
import {Text, ScrollView,View, StyleSheet, Alert} from 'react-native';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Field from '../../../common/Field';
import TextField from '../../../common/TextField';
import TextArea from '../../../common/TextArea';
import Button from '../../../common/Button';
import * as appJson from '../../../../../app';
import * as actions from '../../../../actions/index';
import BaseComponent from "../../../base/BaseComponent";
import {pxTodpHeight, pxTodpWidth} from "../../../../utils/ScreenUtil";

class BillLabelEditForm extends BaseComponent {
    state = {
        data:[],
        selectLabel:[],
    }

    // 构造
    constructor(props) {
        super(props);
        this.setTitle('编辑标签');
        this.item = this.props.navigation.state.params.item;
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
        this._getBillLabel();
    }

    _getBillLabel = async () => {
        this.showActivityIndicator();

        try{
            //分类
            const {type,code,msg,data} = await this.props.postAction(
                appJson.action.billLabelFindDetailById,{id:this.item.id},"查询标签详情");

            this.hideActivityIndicator();

            if(type === appJson.action.billLabelFindDetailById){
                if(code === appJson.action.success){
                    this.props.initialize(data.list[0]);
                }else {
                    this.showToast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e.message || e.note);
        }
    }

    _confirm = ()=>{
        this.hideActivityIndicator();
        this.item?null:this.props.reset();
    }

    _cancel = () => {
        this.hideActivityIndicator();
        this.props.navigation.state.params.callback({});
        this.props.navigation.goBack();
    }

    _handleSubmit = async (object:Object) => {
        const {name} = object;
        if(name === undefined || name === null || name.length === 0){
            this.showToast('请输入名称');
            return;
        }

        try{
            this.showActivityIndicator();

            const {type,code,msg} = await this.props.postAction(appJson.action.billLabelUpdate,object,'编辑标签');
            this.hideActivityIndicator();

            if(type === appJson.action.billLabelUpdate){
                if(code === appJson.action.success){
                    this.showAlert({
                        content:'修改成功',
                        buttons:[{
                            text:'确定',
                            onPress:()=>{
                                this.hideAlert();
                                this.props.navigation.state.params.callback({});
                                this.props.navigation.goBack();
                            }
                        }]
                    })
                }else{
                    this.showToast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e);

        }
    }

    render() {
        super.render();
        let view = (
            <ScrollView style={styles.contain} keyboardShouldPersistTaps={'handled'}>

                <View style={{height:pxTodpHeight(24)}}/>

                <Field name={'name'} component={TextField} title={'名称'} isNeed={true}/>

                <View style={{height:pxTodpHeight(24)}}/>
                <Field name={'descs'} component={TextArea} title={'描述'} isNeed={false} height={100}/>

                <View style={{height:pxTodpHeight(100)}}/>
                <Button style={{height:pxTodpHeight(78),backgroundColor:'#21c3ff',}}
                        onPress={this.props.handleSubmit(this._handleSubmit)}>
                    <Text style={styles.btnSubmit}>提交</Text>
                </Button>

            </ScrollView>
        );

        return super.renderBase(view);;
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

const ReduxLabelEditForm = reduxForm({
    form: 'BillLabelEditForm',
})(BillLabelEditForm)


export default connect(null,actions)(ReduxLabelEditForm);
