import React, { Component } from 'react';
import {
    AppRegistry, AsyncStorage,
    StyleSheet,
    Text,
    View
} from 'react-native';

import PasswordGesture from 'react-native-gesture-password';
import connect from "react-redux/es/connect/connect";
import * as actions from "../../actions";
import BaseComponent from "../base/BaseComponent";
import * as appJson from "../../../app";
import {pxTodpWidth,pxTodpHeight} from "../../utils/ScreenUtil";

//标记手势输入次数
var flag = 4;

class CheckLock extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        header:null,
    });

    onEnd = async (password) => {
        if (password == this.props.lockPassword) {
            await this.setState({
                status: 'right',
                message: ''
            });
            this.props.navigation.navigate('App');
            // your codes to close this view
        } else {
            if(flag > 0){
                await this.setState({
                    status: 'wrong',
                    message: '密码错误，请再次输入，还可以输入'+flag+'次'
                });
                flag -= 1;
            }else{
                this.showActivityIndicator();
                try{
                    await this.props.postAction(appJson.action.signOut,{},'退出');
                }catch (e) {
                }
                this.hideActivityIndicator();
                this.props.navigation.navigate('SignIn')
            }
        }
    }

    onStart = () =>{
        this.setState({
            status: 'normal',
            message: '手势解锁'
        });
    }

    onReset = () =>{
        this.setState({
            status: 'normal',
            message: ''
        });
    }

    render() {
        super.render();
        let view = (
            <PasswordGesture
                style={{marginTop:38,backgroundColor:'#fff'}}
                textStyle={{fontSize:pxTodpWidth(32)}}
                wrongColor={'#ff3d3d'}
                rightColor={'#21c3fe'}
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                onStart={this.onStart}
                onEnd={this.onEnd}
                interval={500}
                innerCircle={true}
                outerCircle={true}
            />
        );

        return super.renderBase(view);
    }
}

const select = ({ user: {token,lockPassword} = {} }) => ({
    token,lockPassword
});

export default connect(select,actions)(CheckLock);