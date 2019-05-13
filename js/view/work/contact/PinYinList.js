import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import {pxTodpHeight,pxTodpWidth} from "../../../common/ScreenUtil";

export type Props = {
    pinYin?:string,
    pinYins:string,
    selectPinYin?:Function,
}

//const pinYins = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#';

const PinYinList = (props:Props) => {
    const {pinYin,pinYins,selectPinYin} = props;
    const pinYinView = () => {
        let pinYinArray = [];
        for(let i=0;i<pinYins.length;i++){
            let key = pinYins.substr(i,1)
            pinYinArray.push(
                <TouchableOpacity key={key} onPress={()=>selectPinYin(key)}
                                  style={{alignItems:'center',width:pxTodpWidth(50)}}>
                    <Text style={{color:pinYin===key?'#21c3fe':'#666666',fontSize:pxTodpWidth(23)}}>
                        {key}
                    </Text>
                </TouchableOpacity>
            )
        }
        return pinYinArray;
    }

    return(
        <View style={{alignItems:'center'}}>{pinYinView()}</View>
    )
}

const styles = StyleSheet.create({

})

export default PinYinList;