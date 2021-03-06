import React, { Component } from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";


class About extends BaseComponent {

    state = {

    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('关于我们');
    }



    render() {
        super.render();
        let view = (
            <View style={styles.contain}>

            </View>
        )

        return super.renderBase(view);
    }


}


const styles = StyleSheet.create({
    contain:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
    }
});

export default connect(null,actions)(About);