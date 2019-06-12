import React from 'react';
import {
    Image,
    StyleSheet,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Input from '../../common/Input';
import del from "../../../img/common/delete.png";
import {pxTodpHeight,pxTodpWidth} from "../../../utils/ScreenUtil";

export type Props = {
    onPostfixPress?:Function,
}

const TextField = (props:Props) => {
    const {onPostfixPress,...other}  = props;
    return(
        <Input
            postfix={<Image source={del}/>}
            onPostfixPress={onPostfixPress}
            {...other}
        />
    )
}

const styles = StyleSheet.create({
    contain:{
        backgroundColor:'#ffffff',
    },
    title:{
        fontSize:pxTodpWidth(28),
        color:'#666666',
    },
    inputStyle:{
        width:pxTodpWidth(20),
        height:pxTodpHeight(72),
        borderWidth:1,
        borderColor:'#dcdcdc',
        borderRadius:pxTodpWidth(40),
        fontSize:pxTodpWidth(28),
        color:'#333',
        marginLeft:pxTodpWidth(20),
    }
})

export default TextField;