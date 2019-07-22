// @flow
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert, AsyncStorage,
} from 'react-native';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Button from '../common/Button';
import {md5} from "../../utils/ToolUtil";
import Input from '../common/Input';
import Field from '../common/Field';
import * as actions from '../../actions';
import VCode from './common/VCode';
import BaseComponent from "../base/BaseComponent";
import {pxTodpHeight,pxTodpWidth} from "../../utils/ScreenUtil";
import * as appJson from '../../../app';

class FindPwd extends BaseComponent {

    state={
        visible:false,
        codeMsg:'获取验证码',
        count:0,
    }

    constructor(props) {
        super(props);
        this.setTitle('找回密码');
    }

    componentWillReceiveProps(next){
        if(this.state.count > 0 && !this.timer) {
            this.timer = setInterval(
                () => {
                    if(this.state.count === 0){
                        clearInterval(this.timer);
                        this.timer = undefined;
                        this.setState({codeMsg:'获取验证码'})
                    }else{
                        this.setState({
                            count:this.state.count-1,
                            codeMsg:this.state.count+'s后可点击获取',
                        })
                    }
                },
                1000
            );
        }

    }

    componentWillUnmount(){
        this.timer && clearInterval(this.timer);
    }

    _signUp = async (object:Object) => {
        console.log('---->'+JSON.stringify(object));
        if(!object.tel){
            this.showToast('请输入手机号');
            return;
        }

        if(!object.password){
            this.showToast('请输入密码');
            return;
        }

        if(object.password != object.password1){
            this.showToast('两次密码不一样');
            return;
        }

        if(!object.code){
            this.showToast('请输入验证码');
            return;
        }


        try{
            this.showActivityIndicator();
            const {type,code,msg,data} = await this.props.postAction(appJson.action.findPassword, {
                tel:object.tel,
                password:md5(object.password),
                code:object.code,
            },'创建用户');

            if(type === appJson.action.findPassword){
                if(code === appJson.action.success){
                    await AsyncStorage.removeItem(appJson.key.token);
                    this.showAlert({
                        content:'找回密码成功，去登录?',
                        buttons:[
                            {
                                text:'确定',
                                onPress:()=>{
                                    this.props.navigation.goBack();
                                }
                            }
                        ]
                    });
                }else{
                    this.showToast(msg)
                }
            }
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //获取验证码
    _getCode = async(object:Object) => {
        if(!object.tel){
            this.showToast('请输入手机号');
            return;
        }

        try{
            this.showActivityIndicator();
            const {type,code,msg,data} = await this.props.postAction(appJson.action.getCode,{tel:object.tel},'获取验证码');

            if(type === appJson.action.getCode){
                if(code === appJson.action.success){
                    await this.setState({count:60,});
                    await AsyncStorage.setItem(appJson.key.token,data.token);
                    this.hideActivityIndicator();
                }
                this.showToast(msg);
            }
        }catch (e) {
            this.handleRequestError(e);
        }


    }

    render() {
        super.render();
        const {handleSubmit} = this.props;

        let view = (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps='handled'
            >

                <Field
                    style={styles.input}
                    name={'tel'}
                    placeholder={'请输入手机号'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    component={Input}
                />

                <Field
                    style={styles.input}
                    name={'code'}
                    placeholder={'请输入验证码'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    component={Input}
                    postfix={
                        <VCode
                            disabled={this.state.count>0}
                            msg={this.state.codeMsg}
                            onPress={handleSubmit(this._getCode)}/>
                    }
                />

                <Field
                    style={[styles.input]}
                    name={'password'}
                    placeholder={'请输入密码'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    secureTextEntry
                    component={Input}
                />

                <Field
                    style={styles.input}
                    name={'password1'}
                    placeholder={'请确认密码'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    secureTextEntry
                    component={Input}
                />

                <Button style={{marginTop: pxTodpHeight(60),height:pxTodpHeight(78),backgroundColor:'#21c3ff'}} onPress={handleSubmit(this._signUp)}>
                    <Text style={styles.btnSignIn}>提交</Text>
                </Button>

            </ScrollView>
        );
        return super.renderBase(view);
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingHorizontal: pxTodpWidth(30),
        paddingTop: pxTodpHeight(40),
    },
    switch:{
        flex:1,
        flexDirection: 'row',
        height:30,
    },
    divItem:{
        borderColor: '#21c2fd',
        borderWidth: 1,
        borderTopWidth:0,
        paddingHorizontal:pxTodpWidth(30),
        borderBottomLeftRadius:pxTodpWidth(20),
        borderBottomRightRadius:pxTodpWidth(20),
    },
    switchItem:{
        flex:1,
        borderWidth:1,
        borderBottomWidth:0,
        borderColor:'#21c2fd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input:{
        borderBottomWidth:1,
        borderColor:'#dcdcdc',
        backgroundColor: '#fff',
        height:pxTodpHeight(80),
        marginBottom: pxTodpHeight(20),
        paddingHorizontal: pxTodpWidth(10),
    },
    btnSignIn:{
        fontSize:pxTodpWidth(40),
        color:'#fff'
    },
    bottomText:{
        fontSize: pxTodpWidth(30),
        color:'#666',
        textDecorationLine:'underline'
    },
    bottomView:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:pxTodpHeight(50)
    }
});

const ReduxFindPwd = reduxForm({
    form: 'FindPwd',
})(withNavigation(FindPwd));

export default connect(null, actions)(ReduxFindPwd);
