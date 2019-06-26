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

class UpdateForm extends BaseComponent {
    state = {
        data:[],
        selectSort:[],
    }

    // 构造
    constructor(props) {
        super(props);

        this.item = this.props.navigation.state.params.item;
        this.func = this.props.navigation.state.params.func;
        this.setTitle(this.props.navigation.state.params.title);
        this.item?this.props.initialize(this.item):null;
    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
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

    //添加
    _handleSubmit = async (object:Object) => {
        const {name} = object;
        if(name === undefined || name === null || name.length === 0){
            this.showToast('请输入名称');
            return;
        }

        try{
            this.showActivityIndicator();

            const {type,code,msg} = await this.props.postAction(this.func,object,'添加/编辑方式');
            this.hideActivityIndicator();

            if(type === this.func){
                if(code === appJson.action.success){
                    this.showAlert({
                        content:(this.item?'编辑':'添加')+'成功,是否继续'+'？',
                        buttons:[
                            {
                                text:'是',
                                onPress:this._confirm
                            },
                            {
                                text:'否',
                                onPress:this._cancel
                            }
                        ]
                    });
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

const ReduxUpdateForm = reduxForm({
    form: 'UpdateForm',
})(UpdateForm)


export default connect(null,actions)(ReduxUpdateForm);