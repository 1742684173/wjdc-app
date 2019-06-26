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
import RadioButton from "../../../common/RadioButton";

class AddForm extends BaseComponent {
    state = {
        data:[],
        selectSort:[],
    }

    // 构造
    constructor(props) {
        super(props);
        // {
        //     parentId:0,
        //     parentName:'一级目录'
        // },
        this.item = this.props.navigation.state.params.item;
        this.setTitle('添加分类');
        this.props.initialize({parentId:this.item.parentId,top:0});

    }

    componentDidMount = async () => {
        super.componentDidMount();
        await this.initBase();
    }

    _confirm = ()=>{
        this.hideActivityIndicator();
        this.props.initialize({parentId:this.item.parentId,top:0});
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

            const {type,code,msg} = await this.props.postAction(
                appJson.action.billSortAdd,
                object, '添加分类'
            );

            if(type === appJson.action.billSortAdd){
                if(code === appJson.action.success){
                    this.showAlert({
                        content:'添加成功,是否继续？',
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
            this.hideActivityIndicator();

        }
    }

    render() {
        super.render();
        let view = (
            <ScrollView style={styles.contain} keyboardShouldPersistTaps={'handled'}>

                <View style={{height:pxTodpHeight(24)}}/>

                <View style={{flexDirection:'row',}}>
                    <Text style={{fontSize:pxTodpWidth(28), color:'#666666',}}>
                        <Text style={{color:'#eb3232'}}>*</Text>父类
                    </Text>

                    <Text style={{marginLeft:pxTodpWidth(20),fontSize:pxTodpWidth(28), color:'#333',}}>
                        {this.item.parentName}
                    </Text>
                </View>

                <View style={{height:pxTodpHeight(24)}}/>

                <Field name={'name'} component={TextField} title={'名称'} isNeed={true}/>

                <View style={{height:pxTodpHeight(24)}}/>
                <Field name={'top'} component={RadioButton} title={'置顶'} isNeed={true}
                       values={[{id:0,value:'否'},{id:1,value:'是'}]}
                />

                <View style={{height:pxTodpHeight(24)}}/>
                <Field name={'descs'} component={TextArea} title={'描述'} isNeed={false} height={pxTodpHeight(200)}/>

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

const ReduxAddForm = reduxForm({
    form: 'AddForm',
})(AddForm)


export default connect(null,actions)(ReduxAddForm);
