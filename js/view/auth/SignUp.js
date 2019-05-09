// @flow
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Button from '../../common/Button';
import {pxTodpHeight, pxTodpWidth, md5} from '../../common/ScreenUtil';
import Input from '../../common/Input';
import Field from '../../common/Field';
import * as config from '../../config';
import * as actions from '../../actions';
import VCode from './common/VCode';
import Back from "../../common/Back";

class SignUp extends Component<any> {
  static navigationOptions = ({navigation}) => ({
    headerLeft:<Back navigation={navigation}/>,
    title: '创建用户',
    headerRight:<View/>,
  });

  constructor(props) {
    super(props);
    this.state={
      visible:false,
      codeMsg:'获取验证码',
      count:0,
      isTelType:false,//注册类型 0|电话 1|邮箱
    }
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
    if(!object.account){
      Alert.alert(
        '信息提示',
        '请输入名称/邮箱/电话',
        [
          {text: '确定',},
        ],
        { cancelable: false }
      );
      return;
    }

    if(!object.password){
      Alert.alert(
        '信息提示',
        '请输入密码',
        [
          {text: '确定',},
        ],
        { cancelable: false }
      );
      return;
    }
    let params = Object.assign(object,{password:md5(object.password)});

    this.setState({visible:true});
    const {type} = await this.props.postAction(params);
    this.setState({visible:false});
    //this.props.navigation.navigate('App');
  }

  //获取验证码
  _getCode = async(object:Object) => {
    if(!object.tel || !object.em){
      Alert.alert(
        '信息提示',
        '请输入名称/邮箱/电话',
        [
          {text: '确定',},
        ],
        { cancelable: false }
      );
      return;
    }
    this.setState({count:5,});

  }

  _switchView = () => {
    this.setState({isTelType:!this.state.isTelType});
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >

        <View>
          <View style={styles.switch}>
            <TouchableOpacity
              onPress={this._switchView}
              style={[styles.switchItem, {
                backgroundColor:this.state.isTelType?'#21c2fd':'#ffffff',
                borderTopLeftRadius:pxTodpWidth(20),
              }]}
            >
              <Text style={{fontSize:pxTodpWidth(40), color:this.state.isTelType?'#ffffff':'#21c2fd'}}>
                电话创建
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._switchView}
              style={[styles.switchItem, {
                backgroundColor:this.state.isTelType?'#ffffff':'#21c2fd',
                borderTopRightRadius:pxTodpWidth(20),
              }]}
            >
              <Text style={{fontSize:pxTodpWidth(40), color:this.state.isTelType?'#21c2fd':'#ffffff'}}>
                邮箱创建
              </Text>
            </TouchableOpacity>

          </View>


          <View style={styles.divItem}>
            <Field
              style={styles.input}
              name={!this.state.isTelType?'tel':'email'}
              placeholder={!this.state.isTelType?'请输入手机号':'请输入邮箱'}
              disableUnderline={true}
              returnKeyType={'next'}
              component={Input}
            />

            <Field
              style={styles.input}
              name={'vcode'}
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
              name={'password'}
              placeholder={'请确认密码'}
              disableUnderline={true}
              returnKeyType={'next'}
              secureTextEntry
              component={Input}
            />

          </View>

        </View>

        <Button style={{marginTop: pxTodpHeight(60),height:pxTodpHeight(78)}} onPress={handleSubmit(this._signUp)}>
          <Text style={styles.btnSignIn}>提交</Text>
        </Button>

      </ScrollView>
    );
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

const ReduxSignUp = reduxForm({
  form: 'SignUp',
})(withNavigation(SignUp));

export default connect(null, actions)(ReduxSignUp);
