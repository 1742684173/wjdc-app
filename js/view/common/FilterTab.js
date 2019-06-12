import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text, TouchableOpacity,
} from 'react-native';
import type { Element } from 'react';
import Button from "./Button";
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

export type Props = {
    style?:style,//
    selectBgColor?:string,//选中背景颜色
    unSelectBgColor?:string,//未选中背景颜色
    selectFontColor?:string,//选中字体颜色
    unSelectFontColor?:string,//未选中字体颜色
    data:array,//选项 [{id:'1',name:''}]
    value?:string,//选中值
    onFilterItem?:Function,//点击
};

const defaultProps  = {
    style:{},//
    selectBgColor:'#21c3ff',//选中背景颜色
    unSelectBgColor:'#f7f7f7',//未选中背景颜色
    selectFontColor:'#fff',//选中字体颜色
    unSelectFontColor:'#333',//未选中字体颜色
    data:[],//选项 [{id:'1',name:''}]
    value:null,//选中值
    onFilterItem:null,//选中值
};

const FilterTab = (props:Props = defaultProps) => {
    const {
        style,
        selectBgColor,
        unSelectBgColor,
        selectFontColor,
        unSelectFontColor,
        data,
        value,
        onFilterItem,
    } = Object.assign(defaultProps,props);

    return(
        <ScrollView
            style={[styles.contain,style]}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                {
                    data.map((item,i)=>{
                        return (
                            <Button
                                key={i}
                                onPress={()=>onFilterItem(item)}
                                style={{backgroundColor:'#00000000',alignItems:'center'}}>

                                <View style={{
                                    width:64,
                                    height:pxTodpHeight(50),
                                    borderRadius:pxTodpWidth(10),
                                    backgroundColor:item.id===value?selectBgColor:unSelectBgColor,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginRight: pxTodpWidth(6)
                                }}>
                                    <Text style={{fontSize:pxTodpWidth(28), color:item.id===value?selectFontColor:unSelectFontColor}}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={[styles.toggle,{borderTopColor:item.id===value?selectBgColor:'#00000000'}]}/>
                            </Button>
                        )
                    })
                }
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    contain:{
        width:'100%',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        backgroundColor: '#fff'
    },
    toggle:{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: pxTodpWidth(10),
        borderBottomWidth: pxTodpWidth(10),
        borderLeftWidth: pxTodpWidth(20),
        borderRightWidth: pxTodpWidth(20),
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
    }
})


export default FilterTab;