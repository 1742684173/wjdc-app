import React, { Component } from 'react';
import MyDialog from '../../../common/MyDialog';
import {Text, ScrollView,View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import {connect} from 'react-redux';
import * as toast from '../../../common/MyToast';
import Back from '../../../common/Back';
import {formValueSelector, reduxForm} from 'redux-form';
import Field from '../../../common/Field';
import TextField from '../../../common/TextField';
import DateTimeField from '../../../common/DateTimeField';
import RadioButton from '../../../common/RadioButton';
import TextArea from '../../../common/TextArea';
import Button from '../../../common/Button';
import Select from '../../../common/Select';
import * as config from '../../../config';
import * as actions from '../../../actions/index';
import MyLoad from "../../../common/MyLoad";
import moment from "moment";
import BaseComponent from "../../base/BaseComponent";

class BillForm extends BaseComponent {

  state = {
    selectSort:[],
    selectMethod:[],
  }

  // 构造
  constructor(props) {
    super(props);
    this.id = this.props.navigation.state.params.id;
    this.setTitle(this.id?'修改帐单':'增加帐单');
  }

  componentDidMount(){
    this._getBillInfo();
  }

  //获取
  _getBillInfo = async() => {
    this.refs.myLoad.showActivityIndicator();

    try{

      //分类
      const sortData = await this.props.postAction(config.FIND_BILL_SORT,{pageSize:1000},'查询消费类别');
      this._dealParams(sortData);

      //方式
      const methodData = await this.props.postAction(config.FIND_BILL_METHOD,{pageSize:1000},'查询消费方式');
      this._dealParams(methodData);

      //帐单
      const billData = !!!this.id?null:await this.props.postAction(config.FIND_BILL,{id:this.id},'查询消费');
      billData===null?null:this._dealParams(billData);

      this._dealParams({});
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }

  }

  //刷新消费分类
  _onRefreshSort = async () => {
    this.refs.myLoad.showActivityIndicator();
    try{
      //分类
      const sortData = await this.props.postAction(config.FIND_BILL_SORT,{pageSize:1000},'查询消费类别');
      this._dealParams(sortData);
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }
  }

  //消费消费方式
  _onRefreshMethod = async () => {
    this.refs.myLoad.showActivityIndicator();
    try{
      //方式
      const methodData = await this.props.postAction(config.FIND_BILL_METHOD,{pageSize:1000},'查询消费方式');
      this._dealParams(methodData);
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }
  }

  //处理返回请求结果
  _dealParams = (params:Object) => {
    let {type,code,msg,data} = params;
    switch (type) {
        //消费类别
      case config.FIND_BILL_SORT:
        let selectSort = [];
        if(code === 1){
          data.list.map((item,i)=>selectSort.push(item));
          if(selectSort.length >0){
            this.setState({selectSort:selectSort});
          }
        }else{
          this.refs.myLoad.showToast(msg);
        }
        break;

      //消费方式
      case config.FIND_BILL_METHOD:
        let selectMethod = [];
        if(code === 1){
          data.list.map((item,i)=>selectMethod.push(item));
          if(selectMethod.length >0){
            this.setState({selectMethod:selectMethod});
          }
        }else{
          this.refs.myLoad.showToast(msg);
        }

        this.props.initialize({
          method:this.state.selectMethod.length>0?this.state.selectMethod[0].id:null,
          sort:this.state.selectSort.length>0?this.state.selectSort[0].id:null,
          dates:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
          type:this.props.sums===1?selectType[0].key:selectType[1].key
        });
        break;

        //修改帐单时查询帐单信息
      case config.FIND_BILL:
        if(code === 1){
          if(data.total > 0){
            this.props.initialize(data.list[0]);
          }else{
            this.refs.myLoad.showToast('帐单数据为空');
          }
        }else{
          this.refs.myLoad.showToast(msg);
        }
        break;

      //通过id删除消费方式
      case config.DELETE_BILL_METHOD_BY_ID:
        if(code === 1){
          this.refs.myLoad.showToast(msg);
          this._onRefreshMethod();
        }else{
          this.refs.myLoad.showToast(msg);
        }
        break;

      //通过id删除消费方式
      case config.DELETE_BILL_SORT_BY_ID:
        if(code === 1){
          this.refs.myLoad.showToast(msg);
          this._onRefreshSort();
        }else{
          this.refs.myLoad.showToast(msg);
        }
        break;

      default:
        this.refs.myLoad.hideActivityIndicator();
        break;

    }
  }

  //添加
  _addBill = async (object:Object) => {

    const {method,dates,sums,sort} = object;
    if(sums === undefined || sums === null || sums.length === 0){
      this.refs.myLoad.showToast('请输入消费金额');
      return;
    }

    if(sort === undefined || sort === null || sort.length === 0){
      this.refs.myLoad.showToast('请选择消费分类');
      return;
    }

    this.refs.myLoad.showActivityIndicator();
    try{
      const {type,code,msg,data} = await this.props.postAction(config.ADD_BILL,Object.assign(object,{sums:sums*method}),'添加帐单','form');
      console.log('=>'+JSON.stringify(data));

      if(type === config.ADD_BILL){
        if(code === 1){
          this.refs.myLoad.showAlert({
            content:'添加成功,是否继续？',
            confirmText:'是',
            cancelText:'否',
            confirm:()=>{
              this.props.initialize({
                method:this.state.selectMethod.length>0?this.state.selectMethod[0].id:null,
                sort:this.state.selectSort.length>0?this.state.selectSort[0].id:null,
                dates:moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
                type:this.props.sums===1?selectType[0].key:selectType[1].key
              });
            },
            cancel:()=>{
              this.props.navigation.state.params.callback({});
              this.props.navigation.goBack();
            }
          });

        }else{
          this.refs.myLoad.showToast(msg);
        }
      }
    }catch (e) {
      this.refs.myLoad.showToast(e.message||'未知错误');
    }
  }

  //增加分类
  _addSortBtn = () => {
    this.props.navigation.navigate('AddSort',{
      title:'添加消费分类',
      func:config.ADD_BILL_SORT,
      callback:this._onRefreshSort
    });
  }

  //增加方式
  _addMethodBtn = () => {
    this.props.navigation.navigate('BillMethodForm',{
      title:'添加消费方式',
      func:config.ADD_BILL_METHOD,
      callback:this._onRefreshMethod
    });
  }

  //编辑方式
  _editMethodBtn = (item) =>{
    this.props.navigation.navigate('AddSort',{
      title:'编辑消费方式',
      item,
      func:config.UPDATE_BILL_METHOD,
      callback:this._onRefreshMethod
    });
  }

  //编辑分类
  _editSortBtn = (item) =>{
    this.props.navigation.navigate('AddSort',{
      title:'编辑消费分类',
      item,
      func:config.UPDATE_BILL_SORT,
      callback:this._onRefreshSort
    });
  }

  _cancelDelete = () => {

  }

  //提示是否通过id删除消费方式
  _deleteMethodBtn = (item) => {
    this.refs.myLoad.showAlert({
      content:'确认删除【'+item.name+'】?',
        cancel:this._cancelDelete,
      confirm:()=>this._confirmDeleteMethod(item.id)
    });
  }

  //确认删除消费方式
  _confirmDeleteMethod = async (id:number) => {
    this.refs.myLoad.showActivityIndicator();
    try{
      //方式
      const methodData = await this.props.postAction(config.DELETE_BILL_METHOD_BY_ID,{id:id},'通过id删除消费方式');
      this._dealParams(methodData);
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }
  }

  //提示是否通过id删除消费类别
  _deleteSortBtn = (item) => {
    this.refs.myLoad.showAlert({
      content:'确认删除【'+item.name+'】?',
      cancel:this._cancelDelete,
      confirm:()=>this._confirmDeleteSort(item.id)
    });
  }

  //确认删除消费类别
  _confirmDeleteSort = async (id:number) => {
    this.refs.myLoad.showActivityIndicator();
    try{
      //方式
      const methodData = await this.props.postAction(config.DELETE_BILL_SORT_BY_ID,{id:id},'通过id删除消费方式');
      this._dealParams(methodData);
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }
  }

  render() {
    super.render();
    let view = (
      <ScrollView style={styles.contain} keyboardShouldPersistTaps={'handled'}>

        <View style={{height:pxTodpHeight(24)}}/>
        <Field name={'type'} component={RadioButton} title={'消费类型'} isNeed={true}
          values={selectType}
          defaultValue={this.props.sums===1?selectType[0].key:selectType[1].key}
        />

        <Field name={'dates'} component={DateTimeField}
          mode={'datetime'} title={'消费时间'} isNeed={true}
        />

        <View style={{height:pxTodpHeight(10)}}/>

        <Field name={'sums'} component={TextField}
          title={'消费金额'} isNeed={true} keyboardType={'numeric'}
        />

        <View style={{height:pxTodpHeight(190)}}/>
        <Field name={'descs'} component={TextArea}
          title={'消费描述'} isNeed={false} height={pxTodpHeight(200)}
        />

        <View style={{height:pxTodpHeight(100)}}/>
        <Button style={{height:pxTodpHeight(78)}} onPress={this.props.handleSubmit(this._addBill)}>
          <Text style={styles.btnSubmit}>提交</Text>
        </Button>

        <View style={{position:'absolute',top:pxTodpHeight(370)}}>
          <Field
            name={'sort'} component={Select} title={'消费分类'} isNeed={true}
            values={this.state.selectSort}
            isShowAdd={true}
            addBtn={this._addSortBtn}
            isShowEdit={true}
            editBtn={this._editSortBtn}
            isShowDelete={true}
            deleteBtn={this._deleteSortBtn}
          />
        </View>

        <View style={{position:'absolute',top:pxTodpHeight(280)}}>
          <Field
            name={'method'} component={Select} title={'消费方式'} isNeed={true}
            values={this.state.selectMethod}
            isShowAdd={true}
            addBtn={this._addMethodBtn}
            isShowEdit={true}
            editBtn={this._editMethodBtn}
            isShowDelete={true}
            deleteBtn={this._deleteMethodBtn}
          />
        </View>



      </ScrollView>
    );

    return super.renderBase(view);
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

const ReduxBillForm = reduxForm({
  form: 'BillForm',
})(BillForm)

export default connect(null,actions)(ReduxBillForm);
