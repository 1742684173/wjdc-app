import React from 'react';
import{
    StyleSheet,
    Text,
    View
}from 'react-native';
import Input from './Input';

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
        fontSize:14,
        color:'#666666',
    },
    inputViewStyle:{
        height:36,
        borderWidth:1,
        borderColor:'#dcdcdc',
        borderRadius:20,
        marginLeft:10,
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