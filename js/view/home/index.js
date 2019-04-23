// @flow
import React, { Component } from 'react';
import Bill from '../work/bill';
import Carousel from "./Carousel";
import {View} from "react-native";

export default class Home extends Component<any> {
  static navigationOptions = ({navigation}) => ({
    headerLeft:<View/>,
    title: '首页',
    headerRight:<View/>,
  });

  constructor(props){
    super(props);
    this.state =({
      screen:0,//显示第几屏
      selectedIndexScreen:0,
    });
  }

  _onSelectedIndexChange = (selectedIndex) => {
    if(selectedIndex >= this.state.selectedIndexScreen){
      this.setState({selectedIndexScreen:selectedIndex});
    }
    this.setState({screen:selectedIndex});
  }

  render() {
    const screens = [
      <Bill key={0} navigation={this.props.navigation}/>,
    ];

    return (
      <Carousel
        count={screens.length}
        selectedIndex={this.state.screen}
        selectedIndexScreen={this.state.selectedIndexScreen}
        onSelectedIndexChange={this._onSelectedIndexChange}
        renderCard={screens}
      />
    );
  }

}