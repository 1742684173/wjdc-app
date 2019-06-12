import React,{Component} from 'react';
import {View,Text,ActivityIndicator} from 'react-native';
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

export default class LoadView extends Component{
    render(){
        if(this.props.foot === 0){
            return null;
        }else if(this.props.foot === 1){
            return (
                <View style={{height:pxTodpHeight(60),marginTop:pxTodpHeight(30),alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:pxTodpWidth(28),marginTop:pxTodpHeight(10),marginBottom:pxTodpHeight(10),}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        }else if(this.props.foot === 2){
            return (
                <View style={{flexDirection:'row',marginTop:pxTodpHeight(30), width:pxTodpWidth(690), justifyContent:'center',}}>
                    <ActivityIndicator/>
                    <Text style={{color:'#333',fontSize:pxTodpWidth(24)}}>加载中</Text>
                </View>
            )
        }else{
            return null;
        }
    }
}