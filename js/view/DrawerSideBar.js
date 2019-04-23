// @flow
import React, { Component } from 'react';
import {StyleSheet, View, Text, Button, TouchableHighlight, AsyncStorage} from 'react-native';
import { connect } from 'react-redux';
import {pxTodpHeight, pxTodpWidth} from "../common/ScreenUtil";
import MyDialog from "../common/MyDialog";
import * as actions from "../actions";
import * as config from "../config";

class DrawerSideBar extends Component<any> {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
    }
  }

  _exit = async () => {
    this.setState({visible:true});
    const {type,code,msg,data} = await this.props.postAction(config.SIGN_OUT,{},'登出');
    console.log('=>'+JSON.stringify(data));
    this.setState({visible:false});
    this.props.navigation.navigate('SignIn');
  }

  render() {
    return (
      <View style={styles.content}>

        <MyDialog isLoad={true} visible={this.state.visible} onRequestClose={()=>{}}/>

        <View style={{marginTop:pxTodpHeight(200)}}>
          <Text onPress={this._exit}>
            退出
          </Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: pxTodpHeight(30),
    paddingLeft: pxTodpWidth(15),
    //backgroundColor: '#6b52ae',
    backgroundColor:"#fff"
  },
  button: {
    height: pxTodpHeight(50),
    marginBottom: pxTodpHeight(20),
  },
  text: {
    color: '#fff',
    fontSize: pxTodpWidth(18),
  },
});

export default connect(null, actions)(DrawerSideBar);
