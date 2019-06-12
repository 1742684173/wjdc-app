// @flow
import React, { Component } from 'react';
import BillInfo from '../work/bill';
import Carousel from "../common/Carousel";
import {View} from "react-native";
import Bills from "../work/bill/BillHistory";
import BillTotal from "../work/bill/BillTotal";

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
            <BillInfo key={1} navigation={this.props.navigation}/>,
            <Bills key={2} navigation={this.props.navigation}/>,
            <BillTotal key={3} navigation={this.props.navigation}/>,
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