import React, { Component } from 'react';
import {Text, ScrollView,View, StyleSheet, Alert} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import {connect} from 'react-redux';
import Back from '../../../common/Back';
import {reduxForm} from 'redux-form';
import Field from '../../../common/Field';
import TextField from '../../../common/TextField';
import TextArea from '../../../common/TextArea';
import Button from '../../../common/Button';
import * as config from '../../../config';
import * as actions from '../../../actions/index';
import MyLoad from "../../../common/MyLoad";

class AddSort extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft:<Back navigation={navigation}/>,
    title: navigation.state.params.title,
    headerRight:<View/>,
  });

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      data:[],
      selectSort:[],
    };

    this.item = this.props.navigation.state.params.item;
    this.func = this.props.navigation.state.params.func;
    console.log(this.func);
  }

  componentWillMount(){
    this.item?this.props.initialize(this.item):null;
  }

  _confirm = ()=>{
    this.refs.myLoad.hideActivityIndicator();
    this.item?null:this.props.reset();
  }

  _cancel = () => {
    this.refs.myLoad.hideActivityIndicator();
    this.props.navigation.state.params.callback({});
    this.props.navigation.goBack();
  }

  //添加
  _handleSubmit = async (object:Object) => {
    const {name} = object;
    if(name === undefined || name === null || name.length === 0){
      this.refs.myLoad.showToast('请输入分类名称');
      return;
    }

    try{
      this.refs.myLoad.showActivityIndicator();

      let myParams = Object.assign(object,{parentid:1})
      const {type,code,msg,data} = await this.props.postAction(this.func,myParams,'添加/编辑分类','form');
      console.log('=>'+JSON.stringify(data));

      if(type === this.func){
        if(code === 1){
          this.refs.myLoad.showAlert({
            content:(this.item?'编辑':'添加')+'分类成功,是否继续'+'？',
            confirmText:'是',
            cancelText:'否',
            confirm:this._confirm,
            cancel:this._cancel
          });
        }else{
          this.refs.myLoad.showToast(msg);
        }
      }else{
        this.refs.myLoad.showToast('找不到请求地址');
      }
    }catch (e) {
      this.refs.myLoad.showToast(e.message||'未知错误');
    }
  }

  render() {
    return (
      <ScrollView style={styles.contain} keyboardShouldPersistTaps={'handled'}>

        <MyLoad ref={'myLoad'}/>

        <View style={{height:pxTodpHeight(24)}}/>

        <Field
          name={'name'}
          component={TextField}
          title={'分类名称'}
          isNeed={true}
        />

        <View style={{height:pxTodpHeight(24)}}/>
        <Field
          name={'descs'}
          component={TextArea}
          title={'分类描述'}
          isNeed={false}
          height={pxTodpHeight(200)}
        />

        <View style={{height:pxTodpHeight(100)}}/>
        <Button style={{height:pxTodpHeight(78),marginHorizontal: pxTodpWidth(30)}}
                onPress={this.props.handleSubmit(this._handleSubmit)}>
          <Text style={styles.btnSubmit}>提交</Text>
        </Button>

      </ScrollView>
    )
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

const ReduxAddSortForm = reduxForm({
  form: 'AddSort',
})(AddSort)


export default connect(null,actions)(ReduxAddSortForm);
