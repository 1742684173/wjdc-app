// @flow
import React, { Component } from 'react';
import {StyleSheet, View, Text, Button, TouchableHighlight, AsyncStorage} from 'react-native';
import { connect } from 'react-redux';
import * as actions from "../actions";
import * as appJson from "../../app";
import {
    getCurrentMonthEndDate,
    getCurrentMonthStartDate,
    getCurrentWeekEndDate, getCurrentYearEndDate, getCurrentYearStartDate,
    getLastWeekStartDate,
    getTodayEndDate,
    getTodayStartDate
} from "../utils/DateUtil";
import BaseComponent from "./base/BaseComponent";

class DrawerSideBar extends BaseComponent<any> {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
        }
    }

    _exit = async () => {
        this.showActivityIndicator();
        try{
            await this.props.postAction(appJson.action.signOut,{},'退出');
            this.hideActivityIndicator();
            this.props.navigation.navigate('Auth');

        }catch (e) {
            this.handleRequestError(e);
        }
    }

    render() {
        super.render();
        let view = (
            <View style={styles.content}>

                <View style={{marginTop:100}}>
                    <Text onPress={this._exit}>
                        退出
                    </Text>
                </View>

            </View>
        )
        return super.renderBase(view);
    }
}

const styles = StyleSheet.create({
    content: {
        flex:1,
        paddingTop: 15,
        paddingLeft: 8,
        //backgroundColor: '#6b52ae',
        backgroundColor:"#fff"
    },
    button: {
        height: 25,
        marginBottom: 10,
    },
    text: {
        color: '#fff',
        fontSize: 9,
    },
});

export default connect(null, actions)(DrawerSideBar);
