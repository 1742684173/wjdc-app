import React,{Component} from 'react';
import{StyleSheet, Text, View, TouchableOpacity, Image,ScrollView}from 'react-native';
import {pxTodpHeight,pxTodpWidth} from "./ScreenUtil";

export type Props = {
  values:Array,//选项
  title:string,//标签名称
  isNeed:boolean,//是否必填
  isShowAdd:boolean,//是否显示添加按钮
  addBtn:Function,//添加按钮方法
  isShowEdit:boolean,//是否显示编辑按钮
  editBtn:Function,//编辑按钮方法
  isShowDelete:boolean,//是否显示删除按钮
  deleteBtn:Function,//删除按钮方法
}

import upPic from '../img/common/up.png';
import downPic from '../img/common/down.png';
import selectPic from '../img/common/select.png';
import add from '../img/common/add.png';
import edit from '../img/common/edit.png';
import del from '../img/common/delete1.png';


export default class Select extends Component{

  constructor(props){
    super(props);
    this.state = {
      isExpand:false,
    }
  }

  hide = () => {
    this.setState({isExpand:false});
  }

  setValue = (item) => {
    this.setState({isExpand:false});
    this.props.onChange(item.id);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.values !== this.props.values){
      nextProps.values.length > 0?this.props.onChange(nextProps.values[0].id):null;
    }
  }

  render(){
    const {
      values,
      title,
      isNeed,
      isShowAdd,
      addBtn,
      isShowEdit,
      editBtn,
      deleteBtn,
      isShowDelete,
      value,
      onChange
    } = this.props;

    let select = values.map((item,i)=>{
      return(
        <View key={i}  style={[styles.itemView,styles.optionItem]}>
          {
            isShowEdit?(
              <TouchableOpacity style={{marginRight: pxTodpWidth(30)}} onPress={()=>editBtn(item)}>
                <Image source={edit}/>
              </TouchableOpacity>
            ):null
          }

          {
            isShowDelete?(
              <TouchableOpacity style={{marginRight: pxTodpWidth(20)}} onPress={()=>deleteBtn(item)}>
                <Image source={del}/>
              </TouchableOpacity>
            ):null
          }

          <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'space-between'}} onPress={()=>{
            onChange(item.id);
            this.setState({isExpand:false})
          }}>
            <Text style={styles.inputStyle}>{item.name}</Text>
            {item.id===value?<Image source={selectPic}/>:null}
          </TouchableOpacity>

        </View>
      )
    })

    let showText = values.map((item,i)=>{
      if(value === item.id){
        return item.name;
      }else{
        return '';
      }
    })

    return(
      <View style={styles.contain}>
        <Text style={[styles.titleStyle]}>
          <Text style={{color:'#eb3232'}}>{isNeed?'*':'  '}</Text>{title}
        </Text>

        <View style={{marginTop:pxTodpHeight(-20),marginLeft:pxTodpWidth(20),}}>
          <View style={[styles.selectView,values.length>6?{height:this.state.isExpand?pxTodpHeight(500):pxTodpHeight(80)}:null]}>
            <View style={[styles.itemView]}>

              <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems: 'center',justifyContent: 'space-between'}}
                onPress={()=>this.setState({isExpand:!this.state.isExpand})}>
                  <Text style={styles.inputStyle}>{showText}</Text>
                  <Image source={this.state.isExpand?upPic:downPic}/>
              </TouchableOpacity>
              {
                isShowAdd?(
                  <TouchableOpacity onPress={addBtn} style={{marginLeft:pxTodpWidth(30)}}>
                    <Image source={add}/>
                  </TouchableOpacity>
                ):null
              }
            </View>
            <ScrollView style={[values.length>6?{height:this.state.isExpand?pxTodpHeight(500):pxTodpHeight(80)}:null]}>
              {this.state.isExpand? select :null}
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  contain:{
    flexDirection:'row',
    //alignItems: 'center'

  },
  titleStyle:{
    //marginRight:pxTodpWidth(45),
    backgroundColor:'#ffffff',
    fontSize:pxTodpWidth(28),
    color:'#666666',
  },
  selectView:{
    //flex:1,
    backgroundColor:'#fff',
    borderRadius:pxTodpWidth(40),
    borderWidth:1,
    borderColor:'#dcdcdc',
    paddingHorizontal:pxTodpWidth(40),
    //paddingVertical:pxTodpHeight(10),
    width:pxTodpWidth(540),
    //height:pxTodpHeight(500),
    // marginLeft:pxTodpWidth(20),
    // marginTop:pxTodpHeight(-20),
    position:'absolute',
    //zIndex:1000,
    // height:pxTodpHeight(72)
  },
  inputStyle:{
    fontSize:pxTodpWidth(28),
    color:'#333',
  },
  itemView:{
    height:pxTodpHeight(72),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  optionItem:{
    //marginHorizontal:pxTodpWidth(10),
    //paddingLeft:pxTodpWidth(20),
    marginTop:pxTodpHeight(10),
    borderBottomColor:'#dcdcdc',
    borderBottomWidth:1,
  }
})

