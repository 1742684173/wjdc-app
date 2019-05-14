import React from 'react';
import {
    StyleSheet,
    View,
    Text, TouchableOpacity,
} from 'react-native';
import type { Element } from 'react';
import { ScreenWidth,ScreenHeight} from './ScreenUtil';

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
        <View style={[styles.contain,style]}>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                {
                    data.map((item,i)=>{
                        return (
                            <TouchableOpacity
                                onPress={()=>onFilterItem(item)}
                                style={{alignItems:'center'}}>

                                <View style={{
                                    width:64,
                                    height:25,
                                    borderRadius:5,
                                    backgroundColor:item.id===value?selectBgColor:unSelectBgColor,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginRight: 3,
                                }}>
                                    <Text style={{fontSize:14, color:item.id===value?selectFontColor:unSelectFontColor}}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View style={[styles.toggle,{borderTopColor:item.id===value?selectBgColor:'#00000000'}]}/>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>

            <View style={{justifyContent: 'center',}}>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    contain:{
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    toggle:{
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
    }
})


export default FilterTab;