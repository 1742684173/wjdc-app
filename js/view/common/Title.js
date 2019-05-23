import React from 'react';
import {
    StyleSheet,
    View,
    Text,
}from 'react-native';
import type { Element } from 'react';

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
            <Text style={{fontSize:12,color:'#999999'}}>{smallText}</Text>
            <Text style={{fontSize:11}}>{unit}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    smallTitleView:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:15,
    },
    //分类标题前面的图片
    smallTitleImage:{
        // backgroundColor:'#21c2fd',
        height:15,
        width:5,
        borderRadius:3,
        marginRight:5,
    },
    //分类标题
    smallTitleText:{
        color:'#333333',
        fontSize:15,
    },
})


export default Title;