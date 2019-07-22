import React, { Component } from 'react';
import {ScrollView, StyleSheet, Text, View,Image} from 'react-native';
import {connect} from 'react-redux'
import {pxTodpHeight,pxTodpWidth} from "../../utils/ScreenUtil";
import rightImg from '../../img/common/right.png';
import Button from "../common/Button";

class Mine extends Component {
    // static navigationOptions = (navigation) =>({
    //     header:null,
    // })

    _onPress = (nav) => {
        this.props.navigation.navigate(nav);
    }

    render(){
        return (
            <View style={{flex:1}}>
                <View style={{height:pxTodpHeight(300),backgroundColor:'#00b3ff'}}>

                </View>

                <Button style={styles.itemView} onPress={()=>this._onPress('Service')}>
                    <Text style={styles.itemFontFront}>我的客服</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('Share')}>
                    <Text style={styles.itemFontFront}>分享好友</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('Set')}>
                    <Text style={styles.itemFontFront}>系统设置</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('Help')}>
                    <Text style={styles.itemFontFront}>帮助反馈</Text>
                    <Image source={rightImg}/>
                </Button>

                <Button style={styles.itemView} onPress={()=>this._onPress('About')}>
                    <Text style={styles.itemFontFront}>关于我们</Text>
                    <Image source={rightImg}/>
                </Button>
            </View>
        );
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


export default connect(null, null)(Mine);