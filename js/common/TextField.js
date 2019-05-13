import React from 'react';
import{
    StyleSheet,
    Text,
    View
}from 'react-native';
import Input from './Input';
import {pxTodpHeight,pxTodpWidth} from "./ScreenUtil";

export type Props = {
    title:string,
    isNeed:boolean,
}

const TextField = (props:Props) => {
    const {
        title,
        isNeed,
        ...other
    } = props;

    return(
        <Input
            postfix={<View/>}
            prefix={<Text style={styles.title}><Text style={{color:'#eb3232'}}>{isNeed?'*':'  '}</Text>{title}</Text>}
            //style={styles.inputViewStyle}
            inputStyle={styles.inputStyle}
            disableUnderline={true}
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
    inputViewStyle:{
        height:pxTodpHeight(72),
        borderWidth:1,
        borderColor:'#dcdcdc',
        borderRadius:pxTodpWidth(40),
        marginLeft:pxTodpWidth(20),
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