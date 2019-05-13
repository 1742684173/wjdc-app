import {
    Dimensions,
    PixelRatio,
    Platform,
} from 'react-native';
import {ifIphoneX} from "react-native-iphone-x-helper";
import forge from 'node-forge';
import * as DeviceInfo from "react-native-device-info";

const ScreenWidth = Dimensions.get("window").width;//360
const ScreenHeight = Dimensions.get("window").height;//604 有问题！！！！！
const scale = Dimensions.get('window').scale;//分辨率
const pix =  PixelRatio.get();
const uiWidth = 750;//ui设计宽度
const uiHeight = 1334;//ui设计宽度
const iosX  = Platform.OS==='ios'?(ScreenHeight>=812 ? true:false) : false;

//750*1334
function pxTodpWidth(px){
    return px*ScreenWidth/uiWidth;
}

function pxTodpHeight(px){
    return px*ScreenHeight/uiHeight;
}

//md5加密
function md5(str:string) {
    let md =forge.md.md5.create();
    md.update(str);
    return md.digest().toHex();
}

export {md5,pxTodpWidth,pxTodpHeight};