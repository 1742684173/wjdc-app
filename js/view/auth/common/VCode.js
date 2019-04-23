import React,{Component} from 'react';
import {TouchableOpacity,Text,StyleSheet} from 'react-native';
import type {Element} from "react";

export type Props = {
  msg:string,//显示
  disabled?:boolean,//是不可点击
  onPress?: Function,//点击事件
};

const VCode = (props:Props) => {
  const {msg,disabled,onPress} = props;

  return(
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.div}
    >
      <Text style={{color:!disabled?'#333':'#999'}}>{msg}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  div:{
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default VCode;