import React from 'react';
import {
    StyleSheet,
    View,
    Text,
}from 'react-native';
import type { Element } from 'react';
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

export type Props = {
    text?:String,
    unit?:String,
    smallText?:String,
    style?:any,
    color?:String,
};

const Title = (props:Props) => {
    const {text,unit,smallText,style,color} = props;

    return(
        <View style={[styles.smallTitleView,style]}>
            <View style={[styles.smallTitleImage,{backgroundColor:color==undefined?'#21c2fd':color}]}/>
            <Text style={styles.smallTitleText}>{text}</Text>
            <Text style={{fontSize:pxTodpWidth(24),color:'#999999'}}>{smallText}</Text>
            <Text style={{fontSize:pxTodpWidth(22)}}>{unit}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    smallTitleView:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:pxTodpHeight(30),
    },
    //分类标题前面的图片
    smallTitleImage:{
        // backgroundColor:'#21c2fd',
        height:pxTodpHeight(30),
        width:pxTodpWidth(10),
        borderRadius:pxTodpWidth(6),
        marginRight:pxTodpWidth(10),
    },
    //分类标题
    smallTitleText:{
        color:'#333333',
        fontSize:pxTodpWidth(30),
    },
})


export default Title;