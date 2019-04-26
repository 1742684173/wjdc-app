import React, { Component } from 'react';
import MyDialog from '../../../common/MyDialog';
import {ImageBackground,Text, View, StyleSheet, TouchableOpacity, Image,} from 'react-native';
import {pxTodpWidth, pxTodpHeight, ScreenWidth} from '../../../common/ScreenUtil'
import {connect} from 'react-redux';
import Back from "../../../common/Back";
import Title from "../../../common/Title";
import * as config from '../../../config';
import * as actions from '../../../actions';
import MyLoad from "../../../common/MyLoad";
import addBillPic from '../../../img/work/bill/addBill.png';
import nullDataPic from '../../../img/common/nullDataIcon.png';
import moment from "moment";
import BaseComponent from '../../base/BaseComponent'


class BillInfo extends BaseComponent {

  state = {
    billsData:[],
  }

  // 构造
  constructor(props) {
    super(props);
    this.setTitle('我的帐单');
  }

  componentDidMount = async () => {
    this.showActivityIndicator();
    try{
      let billParams = await this.props.postAction(config.FIND_BILL,{pageSize:5,sortName:'dates'},'查询账单');
      this.dealParam(billParams)
    }catch (e) {
      this.showToast(JSON.stringify(e));
    }
  }

  dealParam = (params) => {
    const {type,code,msg,data} = params;
    switch (type) {
      case config.FIND_BILL:
        if(code === 1){
          this.setState({billsData:data.list})
        }else{
          this.showToast(msg);
        }
        break;
    }
    this.hideActivityIndicator();
  }

  getBillInfo = async () => {
    this.showActivityIndicator();
    try{
      let billParams = await this.props.postAction(config.FIND_BILL,{pageSize:5,sortName:'dates'},'查询账单');
      this.dealParam(billParams)
    }catch (e) {
      this.showToast(JSON.stringify(e));
    }
  }

  //去新增帐单界面
  _onAddBillBtn = () => {
    this.props.navigation.navigate('BillForm',{
      title:'添加帐单',
      callback:(data)=>{
        this.getBillInfo();
      }});
  }

  //去帐单历史记录界面
  _onBillsBtn = () => {
    if(this.state.billsData.length === 0){
      this.showToast('还没有记录哦');
      return;
    }
    this.props.navigation.navigate('Bills');
  }

  render() {
    super.render();
    let view = (
      <View style={styles.contain}>

        {/*所有 本年 本月 当天 上一周 上一月 上一年*/}
        {/*总消费 总收入 总支出*/}
        {/**/}
        <Title text={'总记录'} style={{marginTop:pxTodpHeight(20),marginBottom:pxTodpHeight(10)}}/>

        <View style={styles.div1}>
          <View style={styles.div2}>
            <Text style={styles.font1}>总消费:</Text>
            <Text style={styles.font1}>1000</Text>
          </View>
          <View style={styles.div2}>
            <Text style={styles.font1}>总收入:</Text>
            <Text style={styles.font1}>500</Text>
          </View>
          <View style={styles.div2}>
            <Text style={styles.font1}>总支出:</Text>
            <Text style={styles.font1}>500</Text>
          </View>
        </View>

        <Title text={'快捷功能'} style={{marginTop:pxTodpHeight(30),marginBottom:pxTodpHeight(10)}}/>

        <View style={{marginHorizontal:pxTodpWidth(30),flexDirection: 'row'}}>
          {/*新增*/}
          <TouchableOpacity onPress={this._onAddBillBtn}>
            <ImageBackground style={styles.div3} source={addBillPic}>
              <Text style={styles.font2}>新增一笔</Text>
            </ImageBackground>
          </TouchableOpacity>

          <View style={{flex:1}}/>

          {/*查找历史消费*/}
          <TouchableOpacity onPress={this._onBillsBtn}>
            <ImageBackground style={styles.div3} source={addBillPic}>
              <Text style={styles.font2}>帐单统计</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <Title text={'最近消费'} style={{marginTop:pxTodpHeight(30),marginBottom:pxTodpHeight(10)}}/>

        {/*当天的消费情况*/}
        <TouchableOpacity style={{flex:1, marginHorizontal:pxTodpWidth(30),}} onPress={this._onBillsBtn}>
          {
            this.state.billsData.length===0?(
              <Image source={nullDataPic} style={{height:pxTodpHeight(210),width:'100%'}} resizeMode={'contain'}/>
            ):this.state.billsData.map((item,i)=>{
              return(
                <View key={i} style={[styles.itemView,{borderTopWidth:i===0?0:1}]}>
                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    {/*分类名称*/}
                    <Text style={{fontSize:pxTodpWidth(30)}}>
                      {item.sortName}
                    </Text>
                    {/*分类金额*/}
                    <Text style={{color:item.sums>0?'#f03':'#00cd00',fontSize:pxTodpWidth(30)}}>
                      {item.sums>0?('+'+item.sums):item.sums}
                    </Text>
                  </View>

                  <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{color:'#999',fontSize:pxTodpWidth(24)}}>
                      来源:{item.methodName}
                    </Text>
                    <Text style={{color:'#999',fontSize:pxTodpWidth(24)}}>
                      时间:{moment(item.dates).format("YYYY-MM-DD hh:mm:ss")}
                    </Text>
                  </View>
                </View>
              )
            })
          }

        </TouchableOpacity>
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
  div1:{
    justifyContent:'space-between',
    width:pxTodpWidth(690),
    height:pxTodpHeight(150),
    backgroundColor:'#21c3ff',
    marginHorizontal: pxTodpWidth(30),
    paddingHorizontal:pxTodpWidth(20),
    paddingVertical:pxTodpHeight(10),
    borderRadius:pxTodpWidth(20),
  },
  font1:{
    color:'#fff',
    fontSize:pxTodpWidth(30)
  },
  div2:{
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  div3:{
    width:pxTodpWidth(333),
    height:pxTodpHeight(300),
    justifyContent:'flex-end',
    alignItems:'center',
    paddingBottom: pxTodpHeight(20),
    borderRadius: pxTodpWidth(20)
  },
  font2:{
    color:'#333',
    fontSize:pxTodpWidth(38)
  },
  itemView:{
    // flexDirection:'row',
    justifyContent:'space-around',
    //alignItems:'center',
    backgroundColor:'#fff',
    height:pxTodpHeight(80),
    paddingHorizontal: pxTodpWidth(20),
    paddingVertical:pxTodpHeight(5),
    borderTopColor:'#dcdcdc',
  }
});

export default connect(null,actions)(BillInfo);