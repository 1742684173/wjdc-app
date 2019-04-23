import React, { Component } from 'react';
import MyDialog from '../../../common/MyDialog';
import {Text, View, StyleSheet, TouchableOpacity, ListView, BackHandler,} from 'react-native';
import {connect} from 'react-redux';
import Back from "../../../common/Back";

class BillDetail extends Component {

  static navigationOptions = ({navigation}) => ({
    headerLeft:<Back navigation={navigation}/>,
    title: '帐单详情',
    headerRight:<View/>,
  });

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      visible:false,//加载框
      data:[],
    };
  }

  render() {
    return (
      <View style={styles.contain}>
        <MyDialog isLoad={true} visible={this.state.visible} onRequestClose={()=>{}}/>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    backgroundColor:'#dcdcdc',
  },
});

export default connect(null,null)(BillDetail);