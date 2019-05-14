import React from 'react';
import {
    Image,
    StyleSheet,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Input from '../../../common/Input';
import del from "../../../img/common/delete.png";

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
        fontSize:14,
        color:'#666666',
    },
    inputStyle:{
        width:10,
        height:36,
        borderWidth:1,
        borderColor:'#dcdcdc',
        borderRadius:20,
        fontSize:14,
        color:'#333',
        marginLeft:10,
    }
})

export default TextField;