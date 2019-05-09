import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {connect} from 'react-redux';
import BaseComponent from "../../base/BaseComponent";
import {postAction} from "../../../actions";
import {pxTodpHeight, pxTodpWidth} from "../../../common/ScreenUtil";
import * as config from "../../../config";
import moment from "moment";

class BillDetail extends BaseComponent {

  state = {
    data:{},
  };

  // 构造
  constructor(props) {
    super(props);
    this.setTitle("帐单详情");
  }

  componentDidMount = async () => {
    await this.initBase();
    this._getBill();
  }

  _getBill = async () => {
    this.showActivityIndicator();

    try{

      //分类
      const {type,code,msg,data} = await this.props.postAction(
        config.BILL_FIND,{
          billId:this.props.navigation.state.params.id,
          all:"all"
        },"查询消费详情");

      if(type === config.BILL_FIND){
        if(code === config.CODE_SUCCESS){
          data.totalCount >0 ? this.setState({data:data.list[0]}):null;
        }
        this.handleRequestError(code,msg);
      }
    }catch (e) {
      this.showToast(e.message || e.note);
    }
    this.hideActivityIndicator();
  }

  render() {
    super.render();
    let view = (
      <View style={styles.contain}>
        <View style={[styles.itemView,{marginTop:0}]}>
          <Text style={styles.textName}>消费时间：</Text>
          <Text style={styles.textValue}>{
            moment(this.state.data.dates).format("YYYY-MM-DD hh:mm:ss")
          }</Text>
        </View>

        <View style={styles.itemView}>
          <Text style={styles.textName}>消费金额：</Text>
          <Text style={styles.textValue}>{this.state.data.sums}</Text>
        </View>

        <View style={styles.itemView}>
          <Text style={styles.textName}>消费方式：</Text>
          <Text style={styles.textValue}>{this.state.data.methodName}</Text>
        </View>

        <View style={styles.itemView}>
          <Text style={styles.textName}>消费分类：</Text>
          <Text style={styles.textValue}>{this.state.data.sortName}</Text>
        </View>

        <View style={styles.itemView}>
          <Text style={styles.textName}>描述：</Text>
          <Text style={styles.textValue}>{this.state.data.descs}</Text>
        </View>
      </View>
    );
    return super.renderBase(view);
  }

}

const styles = StyleSheet.create({
  contain:{
    marginTop:pxTodpHeight(30),
    backgroundColor:'#ffffff',
    marginHorizontal: pxTodpWidth(30),
    paddingHorizontal: pxTodpWidth(30),
    paddingVertical: pxTodpHeight(30),
    width:pxTodpWidth(690),
    borderRadius:pxTodpWidth(20)
  },
  itemView:{
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor:"#dcdcdc",
    paddingBottom: pxTodpHeight(5),
    marginTop:pxTodpHeight(30)
  },
  textName:{
    fontSize:pxTodpWidth(28),
    color:'#666666',
  },
  textValue:{
    fontSize:pxTodpWidth(28),
    color:'#333',
  }
});

export default connect(null,{postAction})(BillDetail);