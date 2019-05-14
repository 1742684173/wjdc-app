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
import Button from '../../common/Button';
import Field from '../../common/Field';
import * as config from '../../config';
import {postAction} from '../../actions';
import Input from '../../common/Input';
import BaseComponent from '../base/BaseComponent';
import {md5} from '../../common/ScreenUtil';

class SignIn extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        header:null,
    });

    componentDidMount = async () => {
        this.showActivityIndicator();

        let account = await AsyncStorage.getItem(config.LOGIN_ACCOUNT_KEY);
        let password = await AsyncStorage.getItem(config.LOGIN_PASSWORD_KEY);
        this.props.initialize({account:account,password:password});

        this.hideActivityIndicator();
    }

    renderDisNet(){
        super.renderDisNet();
        return null;
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
            const {type,code,msg,data} = await this.props.postAction(config.SIGN_IN,params,'登录');
            await AsyncStorage.setItem(config.LOGIN_ACCOUNT_KEY,account);
            await AsyncStorage.setItem(config.LOGIN_PASSWORD_KEY,password);
            if(type === config.SIGN_IN){
                if(code === config.CODE_SUCCESS){
                    await AsyncStorage.setItem(config.LOGIN_TOKEN_KEY,data.token);
                    await this.hideActivityIndicator();
                    this.props.navigation.navigate('App');

                }else{
                    this.handleRequestError(code,msg);
                }
            }
        }catch (e) {
            this.showToast(JSON.stringify(e));
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

                <Button style={{height:39}} onPress={handleSubmit(this._signIn)}>
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
        paddingHorizontal: 15,
        marginTop:100,
    },
    input:{
        borderRadius:20,
        borderWidth: 1,
        borderColor:'#dcdcdc',
        backgroundColor: '#fff',
        height:40,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    btnSignIn:{
        fontSize:20,
        color:'#fff'
    },
    bottomText:{
        fontSize: 15,
        color:'#666',
        textDecorationLine:'underline'
    },
    bottomView:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:25
    }
});

const ReduxSignIn = reduxForm({
    form: 'SignIn',
})(withNavigation(SignIn));


export default connect(null, {postAction})(ReduxSignIn);
