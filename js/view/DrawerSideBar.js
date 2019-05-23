// @flow
import React, { Component } from 'react';
import {StyleSheet, View, Text, Button, TouchableHighlight, AsyncStorage} from 'react-native';
import { connect } from 'react-redux';
import * as actions from "../actions";

class DrawerSideBar extends Component<any> {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
        }
    }

    _exit = async () => {

    }

    render() {
        return (
            <View style={styles.content}>

                <View style={{marginTop:100}}>
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
