import React, { Component } from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import rightImg from "../../../img/common/right.png";
import DeviceInfo from 'react-native-device-info'


class About extends BaseComponent {

    state = {

    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('系统设置');
    }

    _onExit = async () => {
        this.showActivityIndicator();
        try{
            await this.props.postAction(appJson.action.signOut,{},'退出');
            this.hideActivityIndicator();
        }catch (e) {
        }
        this.props.navigation.navigate('Auth');
    }

    _onPress = () => {

    }

    render() {
        super.render();
        let view = (
            <View style={{flex:1}}>

                <View style={{height:pxTodpHeight(10)}}/>

                <Button style={styles.itemView} onPress={()=>this._onPress('Service')}>
                    <Text style={styles.itemFontFront}>更换手机</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('Service')}>
                    <Text style={styles.itemFontFront}>修改密码</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('Service')}>
                    <Text style={styles.itemFontFront}>设备锁</Text>
                    <Image source={rightImg}/>
                </Button>


                <View style={{height:pxTodpHeight(30)}}/>

                <Button style={styles.itemView} onPress={()=>this._onPress('Service')}>
                    <Text style={styles.itemFontFront}>版本号</Text>
                    <Text style={styles.itemFontBehind}>
                        {DeviceInfo.getVersion()}
                    </Text>
                </Button>

                <View style={{height:pxTodpHeight(30)}}/>

                <Button style={styles.itemView} onPress={this._onExit}>
                    <Text style={styles.itemFontFront}>退出登录</Text>
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

export default connect(null,actions)(About);