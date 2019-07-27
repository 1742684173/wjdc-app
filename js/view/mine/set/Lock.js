import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
    AppRegistry, AsyncStorage,
    StyleSheet,
    Text,
    View
} from 'react-native';

import PasswordGesture from 'react-native-gesture-password';
import * as actions from '../../../actions'
// import {disconnect} from "../../../actions/websocket";
import BaseComponent from "../../base/BaseComponent";
import * as appJson from "../../../../app";
import {pxTodpWidth,pxTodpHeight} from "../../../utils/ScreenUtil";

var Password1 = '';

class Lock extends BaseComponent {
    state = {
        message: this.lockPassword?'请验证手势密码':'请输入手势密码',
        status: 'normal'
    }

    constructor(props) {
        super(props);
        this.setTitle('手势设置')

        this.lockPassword = props.lockPassword;
        this.flag = 4;
    }

    onEnd = async (password) => {
        //修改时进行验证
        if(!!this.lockPassword){
            //验证成功
            if(password === this.lockPassword){
                this.lockPassword = null;
                this.setState({
                    status: 'normal',
                    message:'验证成功，请输入新的手势密码'
                });
                this.flag = 4;

            }else{//验证失败

                if(this.flag > 0){
                    this.setState({
                        status: 'wrong',
                        message:'验证失败，请重新验证，还有'+this.flag+'次机会'
                    });
                    this.flag = this.flag - 1;
                }else{
                    this.showActivityIndicator();
                    try{
                        await this.props.postAction(appJson.action.signOut,{},'退出');
                    }catch (e) {
                    }
                    this.hideActivityIndicator();
                    this.props.navigation.navigate('Auth')
                }


            }
        }else{
            if(password.length < 4){
                this.setState({
                    status: 'wrong',
                    message: '到少连接4个点'
                });
                return;
            }
            if ( Password1 === '' ) {
                // The first password
                Password1 = password;
                this.setState({
                    status: 'normal',
                    message: '再次输入以确认'
                });
            } else {
                // The second password
                if ( password === Password1 ) {
                    this.setState({
                        status: 'right',
                        message: '设置成功'
                    });

                    console.log('----->'+this.props.token)
                    let obj = {
                        token:this.props.token,
                        lockPassword:password,
                        userInfo:this.props.userInfo,
                    }
                    await this.props.setGestureAction(obj);
                    Password1 = '';
                    this._goBack();
                } else {
                    this.setState({
                        status: 'wrong',
                        message:  '两次密码不同，请重新输入'
                    });
                    Password1 = '';
                }
            }
        }

    }

    onStart() {
        if ( Password1 === '') {
            this.setState({
                message: '请输入手势密码'
            });
        } else {
            this.setState({
                message: '再次输入以确认'
            });
        }
    }

    render() {
        super.render();
        let view = (
            <PasswordGesture
                style={{marginTop:-38,backgroundColor:'#fff'}}
                textStyle={{fontSize:pxTodpWidth(32)}}
                wrongColor={'#ff3d3d'}
                rightColor={'#21c3fe'}
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                interval={500}
                innerCircle={true}
                outerCircle={true}
            />
        )
        return super.renderBase(view);
    }
}

const select = ({ user: {token,lockPassword,userInfo} = {} }) => ({
    token,lockPassword,userInfo
});

export default connect(select,actions)(Lock);