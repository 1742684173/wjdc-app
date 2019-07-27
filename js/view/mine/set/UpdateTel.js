import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView, AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import Field from "../../common/Field";
import Input from "../../common/Input";
import {reduxForm} from "redux-form";
import {withNavigation} from "react-navigation";
import VCode from "../../auth/common/VCode";


class UpdateTel extends BaseComponent {

    state = {
        codeMsg:'获取验证码',
        count:0,
    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('更换手机');
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

    //获取验证码
    _getCode = async(object:Object) => {
        if(!object.tel || object.tel.length !== 11){
            this.showToast('请输入手机号');
            return;
        }

        try{
            this.showActivityIndicator();
            const {type,code,msg,data} = await this.props.postAction(appJson.action.getCode,{tel:object.tel},'获取验证码');

            if(type === appJson.action.getCode){
                if(code === appJson.action.success){
                    await this.setState({count:60});
                    await AsyncStorage.setItem(appJson.key.codeToken,data.token);
                    this.hideActivityIndicator();
                }
                this.showToast(msg);
            }
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    _onPress = async (object:Object) => {
        if(!object.tel || object.tel.length !== 11){
            this.showToast('请输入手机号');
            return;
        }

        if(!object.code){
            this.showToast('请输入验证码');
            return;
        }

        try{
            this.showActivityIndicator();
            const {type,code,msg,data} = await this.props.postAction(appJson.action.updateTel,object,'修改手机号');
            this.hideActivityIndicator();

            if(type === appJson.action.updateTel){
                if(code === appJson.action.success){
                    this.showAlert({
                        content:'修改成功,返回上一界面',
                        buttons:[
                            {
                                text:'确定',
                                onPress:this._goBack
                            }
                        ]
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
        const {handleSubmit} = this.props;
        let view = (
            <ScrollView style={styles.container}>

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

                <Button style={{marginTop: pxTodpHeight(60),height:pxTodpHeight(78),backgroundColor:'#21c3ff'}} onPress={handleSubmit(this._onPress)}>
                    <Text style={styles.btnSignIn}>提交</Text>
                </Button>

            </ScrollView>
        )

        return super.renderBase(view);
    }


}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingHorizontal: pxTodpWidth(30),
        paddingTop: pxTodpHeight(40),
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

const ReduxUpdateTel = reduxForm({
    form: 'updateTel',
})(withNavigation(UpdateTel));

export default connect(null,actions)(ReduxUpdateTel);