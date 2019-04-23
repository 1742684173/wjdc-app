import React, {Node} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
}from 'react-native';
import {pxTodpHeight, pxTodpWidth, ScreenWidth} from "./ScreenUtil";
export type Props = {
  isLoad?:boolean,//是否加载中
  isChild?:boolean,//是否自定义
  child?:Node,//自定义
  visible?:boolean,//是否显示
  info?:Node,//提示信息
  msg?:string,//提示信息
  cancel?:Function,//取消
  cancelText?:string,//取消显示文字
  confirm?:Function,//确认
  confirmText?:string,//确认显示文字
  onRequestClose?:Function,//返回监听
  height?:number,//窗口高度,有info或msg一定要
  //infoStyle?:any,
}

const MyDialog = (props:Props) => {
  const {
    isChild,
    child,
    isLoad,
    visible,
    info,
    msg,
    cancel,
    cancelText,
    confirm,
    confirmText,
    onRequestClose,
    height
  } = props;
  return(
    <Modal
     animationType={'slide'}
     transparent={true}
     visible={visible}
     onRequestClose={onRequestClose}
     onShow={() => {}}
    >
      <View style={styles.contain}>
        {
          isChild?child:
          isLoad?(<View>
            <ActivityIndicator/>
            <Text style={{color:'#333',fontSize:pxTodpWidth(24)}}>正在加载中...</Text>
          </View>):
          <View style={[styles.modal,{height:pxTodpHeight(height)}]}>
            {
              info?info:<Text style={{color:'#666',fontSize:pxTodpWidth(30)}}>{msg}</Text>
            }
            <View style={styles.btnView}>
              {/*取消按钮*/}
              <TouchableOpacity style={styles.btn} onPress={cancel}>
                <Text style={{fontSize:pxTodpWidth(32),color:'#666666'}}>{cancelText?cancelText:'取消'}</Text>
              </TouchableOpacity>

              <View style={{width:1,height:pxTodpHeight(100),backgroundColor:'#dcdcdc'}}/>

              {/*确认按钮*/}
              <TouchableOpacity style={styles.btn} onPress={confirm}>
                <Text style={{fontSize:pxTodpWidth(32),color:'#21c3fe'}}>{confirmText?confirmText:'确认'}</Text>
              </TouchableOpacity>
            </View>

          </View>
        }

      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    width:ScreenWidth,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(0, 0, 0, 0.3)'
  },
  modal:{
    width:pxTodpWidth(500),
    backgroundColor:'#ffffff',
    //height:pxTodpHeight(300),
    borderRadius:pxTodpWidth(20),
    justifyContent:'space-between'
  },
  infoView:{
    // backgroundColor:'#ff0033',
    width:pxTodpWidth(500),
    height:pxTodpHeight(200),
    justifyContent:'center',
    alignItems:'center',
  },
  info:{
    fontSize:pxTodpWidth(34),
    color:'#333333',
  },
  divider:{
    width:pxTodpWidth(500),
    height:1,
    backgroundColor:'#dcdcdc'
  },
  btnView:{
    width:pxTodpWidth(500),
    height:pxTodpHeight(100),
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopColor:'#dcdcdc',
    borderTopWidth:1


  },
  btn:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  }
})

export default MyDialog;