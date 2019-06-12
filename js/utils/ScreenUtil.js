import {
    Dimensions,
    PixelRatio,
    Platform,
} from 'react-native';
import {ifIphoneX} from "react-native-iphone-x-helper";

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
    //return pxTodpWidth(px);
    //1、iOS11前导航栏的高度是64，其中状态栏(StatusBar)的高度为20。iPhoneX的状态栏(StatusBar)高度变为了44(传感器区域高度)。

    //2、iPhoneX的底部增加了虚拟Home区，由于安全区域的原因默认TabBar的高度由49变为83，增高了34(Home区高度)，所以自定义的底部TabBar也需要需改其适配方案。
    let result = iosX?px*(ScreenHeight-24-34)/uiHeight:px*ScreenHeight/uiHeight;
    return result;
}

export {iosX,pxTodpWidth,pxTodpHeight,ScreenWidth,ScreenHeight,pix};