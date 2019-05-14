import React,{Component} from 'react';
import {View,Text,ActivityIndicator} from 'react-native';

export default class LoadView extends Component{
    render(){
        if(this.props.foot === 0){
            return null;
        }else if(this.props.foot === 1){
            return (
                <View style={{height:30,marginTop:15,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        }else if(this.props.foot === 2){
            return (
                <View style={{flexDirection:'row',marginTop:15, width:345, justifyContent:'center',}}>
                    <ActivityIndicator/>
                    <Text style={{color:'#333',fontSize:12}}>加载中</Text>
                </View>
            )
        }else{
            return null;
        }
    }
}