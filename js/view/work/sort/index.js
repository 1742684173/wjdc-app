import React, { Component } from 'react';
import MyDialog from '../../../common/MyDialog';
import {Text, View, StyleSheet} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import LoadView from '../../../common/LoadView';
import Search from '../../../common/Search';
import {connect} from 'react-redux';
import * as toast from '../../../common/MyToast';
import Back from '../../../common/Back';
import * as config from '../../../config';
import * as actions from '../../../actions/index';
import Button from "../../../common/Button";
import {reduxForm} from "redux-form";
import SortFlatlist from "./SortFlatList";
import MyLoad from "../../../common/MyLoad";

let pageToal=0;
let pageNum = 1;//当前第几页
let condition=null;//查询条件
let type=0;//分类id:1代表帐单分类

class Sort extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft:<Back navigation={navigation}/>,
    title: navigation.state.params.extraData.title,
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
      data:[],
    };

    pageNum = 1;//当前第几页
    condition=null;//查询条件
  }

  componentDidMount(){
    this._getSort();
  }

  //获取
  _getSort = async() => {
    this.refs.myLoad.showActivityIndicator();
    try{
      let params= {parentId:props.navigation.state.params.extraData.type,pageNum:pageNum,pageSize:20,condition:null};
      let {type,code,msg,data} =
        await this.props.postAction(config.FIND_SORT,params,'查询类别');

      if(type === config.FIND_SORT){
        if(code === 1){
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
          this.refs.myLoad.hideActivityIndicator();
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

  //条件查询
  _onSearchBtn = (value) => {
    this.setState({visible:true,foot:1,});
    pageNum = 1;
    condition = value;
    this._getSort();
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
    this._getSort();
  }

  _onRefresh = () => {
    pageNum = 1;
    condition=null;
    this.refs.search.clearSearchInput();
    this._getSort()
  }

  //flatlist底部
  _footView = () => {
    if(this.state.data.length === 0){
      return null;
    }else{
      return <LoadView foot={this.state.foot}/>
    }
  }

  _handleSubmit = () => {
    this.props.navigation.state.params.callback({code:200,});
    this.props.navigation.goBack();
  }

  //去新增帐单界面
  _onAddBtn = () => {
    this.props.navigation.navigate('AddSort',{
      extraData:this.props.navigation.state.params.extraData,
      callback:()=>{
        this._onRefresh();
    }});
  }

  render() {
    return (
      <View style={styles.contain}>

        <MyLoad ref={'myLoad'}/>

        <View style={{backgroundColor:'#ffffff',marginBottom: pxTodpHeight(10)}}>
          <Search
            ref={'search'}
            placeholder={'请输入关键字'}
            onSearchBtn={this._onSearchBtn}
            isShowSearchBefore={true}
            isShowAdd={true}
            isShowSelect={false}
            onAddBtn={this._onAddBtn}
          />
        </View>

        <View style={styles.flatView}>
          <SortFlatlist
            data={this.state.data}
            extraData={this.props.navigation.state.params.extraData}
            footView={this._footView}
            onEndReached={this._onEndReached}
            onRefresh={this._onRefresh}
          />
        </View>

        <Button style={{height:pxTodpHeight(78),marginHorizontal: pxTodpWidth(30)}}
                onPress={this._handleSubmit}>
          <Text style={styles.btnSubmit}>确定</Text>
        </Button>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    backgroundColor:'#f2f2f2',
    paddingBottom:pxTodpHeight(50)
  },
  flatView:{
    flex:1,
    backgroundColor:'#fff',
    marginHorizontal: pxTodpWidth(30),
    padding:pxTodpWidth(20),
    borderRadius:pxTodpWidth(20),
    marginBottom: pxTodpHeight(24)
  }
});

const ReduxSortForm = reduxForm({
  form: 'Sort',
})(Sort)

export default connect(null,actions)(ReduxSortForm);