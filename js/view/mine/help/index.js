import React, { Component } from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import rightImg from "../../../img/common/right.png";


class Help extends BaseComponent {

    state = {

    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('帮助与反馈');
    }

    _onPress = (nav) => {
        this.props.navigation.navigate(nav);
    }

    render() {
        super.render();
        let view = (
            <View style={{flex:1}}>
                <View style={{height:pxTodpHeight(10)}}/>

                <Button style={styles.itemView} onPress={()=>this._onPress('Instruction')}>
                    <Text style={styles.itemFontFront}>帮助</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('Feedback')}>
                    <Text style={styles.itemFontFront}>反馈</Text>
                    <Image source={rightImg}/>
                </Button>
            </View>
        )

        return super.renderBase(view);
    }


}


const styles = StyleSheet.create({
    itemView:{
        backgroundColor:'#fff',
        width:undefined,
        height:pxTodpHeight(100),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:pxTodpHeight(1),
        paddingHorizontal: pxTodpWidth(30),
        borderRadius:0,
    },
    itemFontFront:{
        fontSize: pxTodpWidth(36),
        color:'#333',
    },
    itemFontBehind:{
        fontSize: pxTodpWidth(36),
        color:'#999',
    }
});

export default connect(null,actions)(Help);