import React from 'react';
import type {Element} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Platform,} from 'react-native';
import{pxTodpWidth,pxTodpHeight} from "../../../common/ScreenUtil";
import {numberFormatter} from "../../../common/Tool";

export type Props = {
    data?:any,
    style?:any,
    onPress?:Function,
}

const  data = [
    {bgColor:'#21c3ff', title:'留存手续费(万元)', sTitle1:'公司', sTitle2:'交易所'},
    {bgColor:'#ff8518',title:'净入金(万元)',sTitle1:'期末权益',sTitle2:'期初权益'},
    {bgColor:'#f3cc2a',title:'成交金额(万元)',sTitle1:'成交量(万手)',sTitle2:'市场份额'},
]

const bottom_bg=[
    {bgColor: '#21b3ff' },
    {bgColor: "#ff7700" },
    {bgColor: "#f3bc2a" },
]
const Total = (props:Props) => {
    const {values, color, onPress, } = props;

    return(
        <View style={[styles.contain,{backgroundColor:color}]}>

        </View>
    )
}

const styles = StyleSheet.create({
    contain:{
        justifyContent:'space-between',
        padding: 5,
        borderRadius:10,
    },
})

export default Total;