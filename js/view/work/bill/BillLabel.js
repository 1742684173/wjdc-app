import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Text, View, StyleSheet, Image, Platform,TextInput, TouchableHighlight,TouchableOpacity,ListView,Modal,PixelRatio,ScrollView,SafeAreaView } from 'react-native';
import {pxTodpWidth,pxTodpHeight} from '../../../common/ScreenUtil'
import select from '../../../img/common/select.png';
import Title from "../../../common/Title";
import DataBetween from "../../../common/DataBetween";
import DateTimeField from "../../../common/DateTimeField";
import Field from "../../../common/Field";
import TextField from "../../../common/TextField";
import MySelect from "./common/MySelect";
import {reduxForm} from "redux-form";
import * as actions from "../../../actions";

type Props = {
  modalVisible?:boolean,
};

//按方式查，按种类查 按时间 金额大小 支出/收入
const sortName = [
  {id:'method',name:'按消费方式排序'},
  {id:'sort',name:'按消费类别排序'},
  {id:'dates',name:'按消费时间排序'},
  {id:'sums',name:'按消费金额排序'},
];

class BillLabel extends Component<Props> {

  constructor(props) {
    super(props);
  };

  _onReset = () => {
    this.props.reset();
  }

  _onConfirm = (object:Object) => {
    this.props.submit(object)
  }

  render(){
    const {visible,hideModal,method,sort,onRequestClose,handleSubmit} = this.props;
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <TouchableOpacity
          style={styles.leftView}
          onPress={hideModal}
        />

        <View style={{backgroundColor:'#fff',width:pxTodpWidth(650),height:'100%',position: 'absolute',right: 0}}>

          <ScrollView contentContainerStyle={{marginTop:pxTodpHeight(50)}}>

            <Title text={'根据时间区间查询'} style={styles.title}/>
            <View style={{paddingHorizontal: pxTodpWidth(20)}}>
              <Field name={'startTime'} component={DateTimeField} title={'开始时间'} mode={'date'}/>

              <View style={{height:pxTodpHeight(10)}}/>

              <Field name={'endTime'} component={DateTimeField} title={'结束时间'} mode={'date'}/>
            </View>

            <Title text={'根据金额区间查询'} style={styles.title}/>
            <View style={{marginHorizontal: pxTodpWidth(30)}}>
              <Field name={'minSum'} component={TextField} title={'最小金额'} keyboardType={'numeric'}/>

              <View style={{height:pxTodpHeight(10)}}/>

              <Field name={'maxSum'} component={TextField} title={'最大金额'} keyboardType={'numeric'}/>
            </View>

            <Field name={'sortName'} component={MySelect} title={'排序查询'} values={sortName}/>

            <Field name={'method'} component={MySelect} title={'根据方式查询'} values={method}/>

            <Field name={'sort'} component={MySelect} title={'根据分类查询'} values={sort}/>

            <View style={{height:200}}/>
          </ScrollView>

          <View style={styles.bottomDiv}>

            <TouchableOpacity style={[styles.btn,{backgroundColor:'#ff8518'}]} onPress={this._onReset}>
              <Text style={styles.btnFont}>重置</Text>
            </TouchableOpacity>

            <View style={{width:pxTodpWidth(30)}}/>

            <TouchableOpacity style={styles.btn} onPress={handleSubmit(this._onConfirm)}>
              <Text style={styles.btnFont}>确定</Text>
            </TouchableOpacity>

          </View>
        </View>

      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  bottomDiv:{
    position:'absolute',
    bottom:0,left:0,
    width:pxTodpWidth(650),
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: pxTodpHeight(100),
  },
  btn:{
    width:pxTodpWidth(209),
    height:pxTodpHeight(68),
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#21c3fe',
    borderRadius: pxTodpWidth(30),
  },
  btnFont:{
    fontSize: pxTodpWidth(30),
    color:'#fff',
  },
  leftView:{
    flex:1,
    backgroundColor:'rgba(0, 0, 0, 0.5)',
  },
  div1:{
    flexDirection: 'row',
    flexWrap:'wrap',
    width:pxTodpWidth(650),
    marginVertical: pxTodpWidth(20)
  },
  div2:{
    backgroundColor:'#f8f8f8',
    height:pxTodpHeight(65),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:pxTodpWidth(20),
    paddingVertical: pxTodpHeight(10),
    paddingHorizontal: pxTodpWidth(20),
    marginVertical:pxTodpHeight(5),
    marginLeft: pxTodpWidth(30)
  },
  font1:{
    fontSize:pxTodpWidth(26),
    color:'#333'
  },
  title:{
    marginTop:pxTodpHeight(20),
    marginBottom:pxTodpHeight(10),
    // marginLeft:pxTodpWidth(-5)
  }
});

const ReduxBillLabelForm = reduxForm({
  form: 'BillLabelForm',
})(BillLabel)

export default connect(null,actions)(ReduxBillLabelForm);