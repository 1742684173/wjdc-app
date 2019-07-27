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
import {md5} from "../../../utils/ToolUtil";


class UpdatePassword extends BaseComponent {

    // 构造
    constructor(props){
        super(props);
        this.setTitle('修改密码');
    }

    _onPress = async (object:Object) => {
        const {oldPassword,newPassword,newPassword1} = object;

        if(!oldPassword){
            this.showToast('请输入原密码');
            return;
        }

        if(!newPassword){
            this.showToast('请输入新密码');
            return;
        }

        if(newPassword !== newPassword1){
            this.showToast('两次密码不一致');
            return;
        }

        this.showActivityIndicator();

        try{
            let params = {
                oldPassword:md5(oldPassword),
                newPassword:md5(newPassword),
            };
            const  {type,code,msg} = await this.props.postAction(appJson.action.updatePassword,params,'修改密码');
            if(type === appJson.action.updatePassword){
                if(code === appJson.action.success){
                    await AsyncStorage.removeItem(appJson.key.loginPassword);
                    this.showAlert({
                        content:'修改成功，重新登录',
                        buttons:[{text:'是', onPress:this._exit}]
                    });
                }else{
                    this.showToast(msg);
                }
            }
        }catch (e) {
            this.handleRequestError(e);
        }
    }

    _exit = async ()=>{
        this.showActivityIndicator();
        try{
            await this.props.postAction(appJson.action.signOut,{},'退出');
        }catch (e) {
        }
        this.hideActivityIndicator();
        this.props.navigation.navigate('Auth')
    }

    render() {
        super.render();
        const {handleSubmit} = this.props;
        let view = (
            <ScrollView style={styles.container}>

                <Field
                    style={styles.input}
                    name={'oldPassword'}
                    placeholder={'请输入原密码'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    component={Input}
                />

                <Field
                    style={styles.input}
                    name={'newPassword'}
                    placeholder={'请输入新密码'}
                    disableUnderline={true}
                    returnKeyType={'next'}
                    component={Input}
                />

                <Field
                    style={styles.input}
                    name={'newPassword1'}
                    placeholder={'请确认新密码'}
                    disableUnderline={true}
                    returnKeyType={'done'}
                    component={Input}
                />

                <Button
                    style={{marginTop: pxTodpHeight(60),height:pxTodpHeight(78),backgroundColor:'#21c3ff'}}
                    onPress={handleSubmit(this._onPress)}
                >
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

const ReduxUpdatePassword = reduxForm({
    form: 'UpdatePassword',
})(withNavigation(UpdatePassword));

export default connect(null,actions)(ReduxUpdatePassword);