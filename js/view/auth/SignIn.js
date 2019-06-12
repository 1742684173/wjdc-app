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
import Field from '../common/Field';
import {postAction} from '../../actions';
import Input from '../common/Input';
import BaseComponent from '../base/BaseComponent';
import {md5} from "../../utils/ToolUtil";
import * as appJson from '../../../app';
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

class SignIn extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        header:null,
    });

    componentDidMount = async () => {
        super.componentDidMount();
        await this.showActivityIndicator();

        let account = await AsyncStorage.getItem(appJson.key.loginAccount);
        let password = await AsyncStorage.getItem(appJson.key.loginPassword);
        this.props.initialize({account:account,password:password});

        await this.hideActivityIndicator();
    }

    _signIn = async (object:Object) => {
        const account = object.account;
        const password = object.password;

        if(!account){
            this.showToast('请输入名称/邮箱/电话');
            return;
        }

        if(!password){
            this.showToast('请输入密码');
            return;
        }

        let params = Object.assign({account:account,password:md5(password)});

        this.showActivityIndicator();

        try{
            const {type,code,msg,data} = await this.props.postAction(appJson.action.signIn,params,'登录');
            if(type === appJson.action.signIn){
                if(code === appJson.action.success){
                    await AsyncStorage.setItem(appJson.key.loginAccount,account);
                    await AsyncStorage.setItem(appJson.key.loginPassword,password);
                    await AsyncStorage.setItem(appJson.key.loginToken,data.token);
                    await this.hideActivityIndicator();
                    this.props.navigation.navigate('App');

                }else{
                    this.showToast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    //找回密码
    _goFindPwd = () => {
        this.props.navigation.navigate('FindPwd');
    }

    //前往注册
    _goSignUp = () => {
        this.props.navigation.navigate('SignUp');
    }

    render() {
        super.render();
        const {handleSubmit} = this.props;
        let view = (
            <ScrollView style={styles.container}>

                <Field
                    style={styles.input}
                    name={'account'}
                    placeholder={'请输入用户名/邮箱/手机号'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    keyboardType={'email-address'}
                    component={Input}
                />

                <Field
                    style={[styles.input,{marginBottom: 30,}]}
                    name={'password'}
                    placeholder={'请输入密码'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    secureTextEntry
                    component={Input}
                />

                <Button style={{height:pxTodpHeight(78),backgroundColor:'#21c3ff'}} onPress={handleSubmit(this._signIn)}>
                    <Text style={styles.btnSignIn}>登录</Text>
                </Button>

                <View style={styles.bottomView}>
                    <Text style={styles.bottomText} onPress={this._goFindPwd}>找回密码</Text>

                    <Text style={styles.bottomText} onPress={this._goSignUp}>创建用户</Text>
                </View>

            </ScrollView>
        );
        return super.renderBase(view);
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#f2f2f2',
        paddingHorizontal: pxTodpWidth(30),
        marginTop:pxTodpHeight(200),
    },
    input:{
        borderRadius:pxTodpWidth(40),
        borderWidth: 1,
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

const ReduxSignIn = reduxForm({
    form: 'SignIn',
})(withNavigation(SignIn));


export default connect(null, {postAction})(ReduxSignIn);
