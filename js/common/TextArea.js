import React from 'react';
import {
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import Input from './Input';
import {pxTodpHeight,pxTodpWidth} from "./ScreenUtil";

export type Props = {
    title:string,//标签名称
    isHideTitle:boolean,//是否隐藏标题
    isNeed:boolean,//是否必填
    height:number,//高度
}

const TextArea = (props:Props) => {
    const {title,isNeed,isHideTitle,height,...other} = props;

    return(
        <View style={[styles.contain]}>
            {
                isHideTitle?null:<Text style={[styles.titleStyle]}>
                    <Text style={{color:'#eb3232'}}>{isNeed?'*':'  '}</Text>{title}
                </Text>
            }
            <Input
                postfix={<View/>}
                style={[styles.inputViewStyle,{height:height}]}
                multiline={true}
                textAlignVertical={'top'}
                inputStyle={[styles.inputStyle,{height:height}]}
                disableUnderline={true}
                {...other}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contain:{
        flexDirection:'row',
    },
    titleStyle:{
        fontSize:pxTodpWidth(28),
        color:'#666666',
    },
    inputViewStyle:{
        flex:1,
        flexDirection:'row',
        alignItems:'flex-start',
        borderWidth:1,
        borderColor:'#dcdcdc',
        borderRadius:pxTodpWidth(40),
        marginLeft:pxTodpWidth(20),
    },
    inputStyle:{
        fontSize:pxTodpWidth(28),
        color:'#333',
    }
})

export default TextArea;