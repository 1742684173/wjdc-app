import React, { Component } from 'react';
import MyDialog from '../../../common/MyDialog';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import BillFlatList from './BillFlatList';
import LoadView from '../../../common/LoadView';
import Search from '../../../common/Search';
import {connect} from 'react-redux';
import * as toast from "../../../common/MyToast";
import Back from "../../../common/Back";
import DataBetween from "../../../common/DataBetween";
import * as config from '../../../config';
import * as actions from '../../../actions';
import BillLabel from "./BillLabel";
import {reduxForm} from "redux-form";
import MyLoad from "../../../common/MyLoad";
import moment from "moment";

let pageToal=0;
let pageNum = 1;//当前第几页
let condition=null;//查询条件

class Bills extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft:<Back navigation={navigation}/>,
    title: '历史帐单',
    headerRight:<View/>,
  });

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      visible:true,//加载框
      total:0,//事件总数
      foot:1,
      modelVisible:false,//是否显示model
      data:[],
      selectSort:[],//消费方式
      selectMethod:[],//消费类别
    };

    pageNum = 1;//当前第几页
    condition=null;//查询条件
  }

  componentDidMount(){
    this._getBillInfo();
  }

  _getBillInfo = async () => {
    this.refs.myLoad.showActivityIndicator();

    try{

      //分类
      const sortData = await this.props.postAction(config.FIND_BILL_SORT,{pageSize:1000},'查询消费类别');
      this._dealParams(sortData);

      //方式
      const methodData = await this.props.postAction(config.FIND_BILL_METHOD,{pageSize:1000},'查询消费方式');
      this._dealParams(methodData);

      //帐单
      let params= {pageNum:pageNum,pageSize:10,condition:condition};
      const billData = await this.props.postAction(config.FIND_BILL,params,'查询消费');
      this._dealParams(billData);

      this._dealParams({});
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }
  }

  _dealParams = (params:Object) => {
    let {type,code,msg,data} = params;
    switch (type) {
      //消费类别
      case config.FIND_BILL_SORT:
        let selectSort = [];
        if (code === 1) {
          data.list.map((item, i) => selectSort.push(item));
          if (selectSort.length > 0) {
            this.setState({selectSort: selectSort});
          }
        } else {
          this.refs.myLoad.showToast(msg);
        }
        break;

      //消费方式
      case config.FIND_BILL_METHOD:
        let selectMethod = [];
        if (code === 1) {
          data.list.map((item, i) => selectMethod.push(item));
          if (selectMethod.length > 0) {
            this.setState({selectMethod: selectMethod});
          }
        } else {
          this.refs.myLoad.showToast(msg);
        }

        break;

      //消费
      case config.FIND_BILL:
        if (code === 1) {
          let myData = this.state.data;
          //是否有上一页，有就添加，没有就直接替换
          if(data.hasPreviousPage){
            data.list.map((item,i)=>{
              myData.push(item)
            })
          }else{
            myData = data.list;
          }

          //总页数
          pageToal = data.total;

          let foot = 0;
          //是否有下一页
          if(!data.hasNextPage){
            foot = 1;//listView底部显示没有更多数据了
          }

          this.setState({foot:foot,data:myData});
        } else {
          this.refs.myLoad.showToast(msg);
        }

        break;
      default:
        this.refs.myLoad.hideActivityIndicator();
        break;
    }
  }

  _getBillList = async (object:Object) => {
    this.refs.myLoad.showActivityIndicator();

    try{
      //帐单
      let params= Object.assign({},{pageNum:pageNum,condition:condition},object);
      const billData = await this.props.postAction(config.FIND_BILL,params,'查询消费');
      this._dealParams(billData);

      this._dealParams({});
    }catch (e) {
      this.refs.myLoad.showToast(e.message || e.note);
    }
  }

  //条件查询
  _onSearchBtn = (value) => {
    pageNum = 1;
    condition = value;
    this._getBillList({});
  }

  //加载
  _onEndReached = () => {
    //0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
    if(this.state.foot != 0){
      return;
    }

    if(pageNum!=1 && pageNum>=pageToal){
      //this.setState({foot:1});
      return;
    }else{
      pageNum++;
    }

    //底部显示正在加载更多数据
    this.setState({foot:2});
    //获取数据
    this._getBillList();
  }

  _onRefresh = () => {
    pageNum = 1;
    condition=null;
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
    // this.props.navigation.navigate('AccountDetail', {
    //   item:item,
    //   // callback:(data)=>{
    //   //   this._onRefresh();
    //   // }
    // })
  }

  //去新增帐单界面
  _onAddBtn = () => {
    this.props.navigation.navigate('AddBill',{callback:(data)=>{
        this._onRefresh();
      }});
  }

  // 筛选
  _onSelectBtn = () => {
    this.setState({modelVisible:true});
  }

  //根据条件查询
  _sumbit = (object:Object) => {
    pageNum = 1;
    this._getBillList(object);
  }

  render() {
    return (
      <View style={styles.contain}>

        <BillFlatList
          data={this.state.data}
          footView={this._footView}
          onEndReached={this._onEndReached}
          onRefresh={this._onRefresh}
          onItemClick={this._onItemClick}
        />

        <BillLabel
          visible={this.state.modelVisible}
          method={this.state.selectMethod}
          sort={this.state.selectSort}
          hideModal={()=>this.setState({modelVisible:false})}
          submit={this._sumbit}
          onRequestClose={()=>this.setState({modelVisible:false})}
        />

        <MyLoad ref={'myLoad'}/>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    backgroundColor:'#f2f2f2'
  },
});

export default connect(null,actions)(Bills);