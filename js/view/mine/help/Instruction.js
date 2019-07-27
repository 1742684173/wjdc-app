import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import Field from "../../common/Field";
import TextArea from "../../common/TextArea";


class Instruction extends BaseComponent {

    state = {

    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('帮助');
    }

    render() {
        super.render();
        let view = (
            <View style={{flex:1}}>

            </View>
        )

        return super.renderBase(view);
    }


}


const styles = StyleSheet.create({

});


export default connect(null,actions)(Instruction);
