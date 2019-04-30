import React, { Component } from "react";
import MyDialog from "../../../common/MyDialog";
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from "react-native";
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from "../../../common/ScreenUtil"
import BillsFlatList from "./BillsFlatList";
import LoadView from "../../../common/LoadView";
import Search from "../../../common/Search";
import {connect} from "react-redux";
import * as toast from "../../../common/MyToast";
import Back from "../../../common/Back";
import DataBetween from "../../../common/DataBetween";
import * as config from "../../../config";
import * as actions from "../../../actions";
import BillLabel from "./BillLabel";
import {reduxForm} from "redux-form";
import MyLoad from "../../../common/MyLoad";
import moment from "moment";
import BaseComponent from "../../base/BaseComponent";

class Bills extends BaseComponent {

  state = {
    total:0,//事件总数
    foot:1,
    data:[],
    selectSort:[],//消费方式
    selectMethod:[],//消费类别
    modelVisible:false,//是否显示model
  }

  // 构造
  constructor(props) {
    super(props);
    this.currentPage = 1;
    this.pageSize = 10;
    this.condition = null;
    this.sortName = "dates desc";

    this.setTitle("历史记录");
  }

  componentDidMount(){
    this._getBillList();
  }

  _getBillList = async () => {
    this.showActivityIndicator();

    try{
      //帐单
      let params= {
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        condition:this.condition,
        sortName:this.sortName,
      };
      const {type,code,msg,data} = await this.props.postAction(config.BILL_FIND,params,"查询消费");
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
    this.currentPage = 1;
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
    this.currentPage = 1;
    this.condition=null;
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
    this.props.navigation.navigate("BillDetail", {
      id:item.id,
      callback:(data)=>{
        this._onRefresh();
      }
    })
  }

  //去新增帐单界面
  _onAddBtn = () => {
    this.props.navigation.navigate("BillForm",{
      title:'添加帐单',
      callback:(data)=>{
        this._onRefresh();
      }});
  }

  // 筛选
  _onSelectBtn = () => {
    this.setState({modelVisible:true});
  }

  //根据条件查询
  _sumbit = (object) => {
    this.currentPage = 1;
    console.log(JSON.stringify(object));
    this._getBillList();
  }

  render() {
    super.render();
    let view = (
      <View style={styles.contain}>

        <View style={{backgroundColor:"#ffffff",marginBottom: pxTodpHeight(10)}}>
          <Search
            ref={"search"}
            placeholder={"请转入关健字"}//提示
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

        <BillLabel
          visible={this.state.modelVisible}
          method={this.state.selectMethod}
          sort={this.state.selectSort}
          hideModal={()=>this.setState({modelVisible:false})}
          onSubmit={this._sumbit}
          onReset={()=>{}}
          onRequestClose={()=>this.setState({modelVisible:false})}
        />

        <MyLoad ref={"myLoad"}/>
      </View>
    )

    return super.renderBase(view);
  }

}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    backgroundColor:"#f2f2f2",
  },
});

export default connect(null,actions)(Bills);