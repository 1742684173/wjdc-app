import React, { Component } from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {pxTodpWidth} from "../../common/ScreenUtil";
import {connect} from 'react-redux'

class Mine extends Component {
  static navigationOptions = (navigation) =>({
    title:'我的',
  })

  render(){
    return null;
  }
}

const styles = StyleSheet.create({
  contain:{

  }
});


export default connect(null, null)(Mine);