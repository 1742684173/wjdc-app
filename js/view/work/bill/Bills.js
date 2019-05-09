import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import BillsFlatList from './BillsFlatList';
import LoadView from '../../../common/LoadView';
import Search from '../../../common/Search';
import {connect} from 'react-redux';
import * as config from '../../../config';
import * as actions from '../../../actions';
import BillLabel from './BillLabel';
import BaseComponent from '../../base/BaseComponent';

class Bills extends BaseComponent {

  state = {
    total:0,//事件总数
    foot:1,
    data:[],
    selectSort:[],//消费方式
    selectMethod:[],//消费类别
    selectLabel:{sortName:'dates desc'},//筛选的结果
  }

  // 构造
  constructor(props) {
    super(props);
    this.setTitle('历史记录');

    this.initList();
    this.initLabel();
  }

  //初始化list
  initList = () => {
    this.currentPage = 1;
    this.pageSize = 10;
    this.condition = null;
  }

  //初始化label
  initLabel(){
    this.sortName = 'dates desc';
    this.startTime = null;
    this.endTime = null;
    this.minSum = null;
    this.maxSum = null;
    this.method = null;
    this.sort = null;
  }

  componentDidMount = async () => {
    await this.initBase();
    try{
      //分类
      const sortData = await this.props.postAction(config.BILL_SORT_FIND,{},'查询消费类别');
      this._dealParams(sortData);

      //方式
      const methodData = await this.props.postAction(config.BILL_METHOD_FIND,{},'查询消费方式');
      this._dealParams(methodData);

      await this._getBillList();
    }catch (e) {
      this.showToast(JSON.stringify(e));
    }

  }

  renderLabel(){
    return (
      <BillLabel
        method={this.state.selectMethod}
        sort={this.state.selectSort}
        hideModal={()=>this.initBase()}
        onSubmit={this._sumbit}
        onReset={this._reset}
        onRequestClose={()=>this.initBase()}
        selectLabel={this.state.selectLabel}
      />
    )
  }

  _getBillList = async () => {
    this.showActivityIndicator();

    try{
      //帐单
      let params= Object.assign({
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        condition:this.condition,
        sortName:this.sortName,
        type:this.type,
        startTime:this.startTime,
        endTime:this.endTime,
        minSum:this.minSum,
        maxSum:this.maxSum,
        method:this.method,
        sort:this.sort,
      });
      const {type,code,msg,data} =
        await this.props.postAction(config.BILL_FIND,params,'查询消费');
      if(type === config.BILL_FIND){
        if (code === config.CODE_SUCCESS) {
          let myData = this.state.data;
          if(this.currentPage === 1){
            myData = data.list;
          }else{
            data.list.map((item,i)=>{
              myData.push(item)
            })
          }

          //总页数
          this.totalPage = data.totalPage;

          let foot = 0;
          //是否有下一页
          if(data.currentPage === data.totalPage){
            foot = 1;//listView底部显示没有更多数据了
          }

          this.setState({foot:foot,data:myData});
          this.hideActivityIndicator();
        } else {
          this.handleRequestError(code,msg);
        }
      }

    }catch (e) {
      this.showToast(e.message || e.note);
    }
  }

  //条件查询
  _onSearchBtn = (value) => {
    this.initList();
    this.condition = value;
    this._getBillList();
  }

  //加载
  _onEndReached = () => {
    //0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    if(this.state.foot != 0){
      return;
    }

    if(this.currentPage!=1 && this.currentPage >= this.totalPage){
      //this.setState({foot:1});
      return;
    }else{
      this.currentPage++;
    }

    //底部显示正在加载更多数据
    this.setState({foot:2});
    //获取数据
    this._getBillList();
  }

  _onRefresh = () => {
    this.initList();
    this.refs.search.clearSearchInput();
    this._getBillList()
  }

  //flatlist底部
  _footView = () => {
    if(this.state.data.length === 0){
      return null;
    }else{
      return <LoadView foot={this.state.foot}/>
    }
  }

  //前往详情界面
  _onItemClick = (item) => {
    this.props.navigation.navigate('BillDetail', {
      id:item.id,
      callback:(data)=>{
        this._onRefresh();
      }
    })
  }

  //去新增帐单界面
  _onAddBtn = () => {
    this.props.navigation.navigate('BillForm',{
      title:'添加帐单',
      callback:(data)=>{
        this._onRefresh();
      }});
  }

  // 筛选
  _onSelectBtn = async () => {

    await this.setState({
      dialogType:'others',//load alert others
      isDialogVisible:true,//是否显示加载框
      dialogContent:this.renderLabel(),//当dialogType为alert时是字符串，当是others时是相关控件
      dialogOnRequestClose:()=>{},//modal返回监听
      dialogOnShowClose:()=>{}//modal显示之前调用
    });
  }

  _dealParams = (params:Object) => {
    let {type,code,msg,data} = params;
    switch (type) {
      //消费类别
      case config.BILL_SORT_FIND:
        if(code === config.CODE_SUCCESS){
          if(data.totalCount >0){
            this.setState({selectSort:data.list});
          }
        }else{
          this.handleRequestError(code,msg);
        }
        break;

      //消费方式
      case config.BILL_METHOD_FIND:
        let selectMethod = [];
        if(code === config.CODE_SUCCESS){
          data.list.map((item,i)=>selectMethod.push(item));
          if(selectMethod.length >0){
            this.setState({selectMethod:selectMethod});
          }
        }else{
          this.handleRequestError(code,msg);
        }

        break;

      default:
        break;

    }
  }

  _reset = async () => {
    this.initLabel();
    await this.setState({selectLabel:{}});
    await this._getBillList();
  }

  //根据条件查询
  _sumbit = async (obj) => {
    this.currentPage = 1;

    this.startTime = obj.startTime;
    this.endTime = obj.endTime;

    switch (obj.type) {
      case 'in':
        this.minSum = obj.minSum?obj.minSum:0;
        this.maxSum = obj.maxSum;
        break;

      case 'out':
        this.minSum = obj.maxSum?-1*obj.maxSum:null;
        this.maxSum = 0;
        break;

      default:break;
    }

    this.method = obj.method;
    this.sort = obj.sort;

    await this.setState({selectLabel:obj});

    await this._getBillList();
  }

  render() {
    super.render();
    let view = (
      <View style={styles.contain}>

        <View style={{backgroundColor:'#ffffff',marginBottom: pxTodpHeight(10)}}>
          <Search
            ref={'search'}
            placeholder={'请转入关健字'}//提示
            isShowBeforeBtn={true}//是否显示前面按钮
            onBeforeBtn={this._onSearchBtn}//
            // beforeImg={beforeImg}//图标
            isShowMiddle={true}//是否显示中间按钮
            onMiddleBtn={this._onAddBtn}
            // middleImg={middleImg}//图标
            isShowBehind={true}//是否显示后面按钮
            onBehindBtn={this._onSelectBtn}
            // behindImg={behindImg}//图标
          />
        </View>

        <BillsFlatList
          data={this.state.data}
          footView={this._footView}
          onEndReached={this._onEndReached}
          onRefresh={this._onRefresh}
          onItemClick={this._onItemClick}
        />

      </View>
    )

    return super.renderBase(view);
  }

}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    backgroundColor:'#f2f2f2',
  },
});

export default connect(null,actions)(Bills);