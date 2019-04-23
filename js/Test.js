import React,{Component} from 'react';
import {SafeAreaView} from 'react-native';

import meIcon from './test/img/28_icon_6.png'

export default class Test extends Component{
  state = {
    message:{},
    flag:1,
  }

  _sendMessage = (type,value) => {
    this.setState({flag:this.state.flag === 1?0:1});
    let message = {
      id:Number(Math.random().toString().substr(3,6) + Date.now()).toString(36),
      type:type,
      from:this.state.flag === 1?'111':'222',
      to:'222',
      body:value,
      time:new Date()
    }
    this.setState({message:message});
  }

  render(){
    return null;
  }
}