// @flow

import React,{Component} from 'react';
import {
    Platform,
    StyleSheet
} from 'react-native';
import {pxTodpWidth,pxTodpHeight, ScreenHeight,ScreenWidth} from "./ScreenUtil";
var iosX =Platform.OS==='ios'?(ScreenHeight>=812 ? true:false) : false;

let bgColor = '#f2f2f2';

export default {
  // 颜色
  primaryColor: '#21c3ff',
  placeholderTextColor: '#dcdcdc',
  dividerColor: '#dcdcdc',
  headerTitleTextColor: '#333',
  headerBackgroundColor: '#fff',

  // 字体尺寸
  headerTitleFontSize: 17,

  // 间距
  spacingXS: 4,
  spacingSM: 8,
  spacingMD: 15,
  spacingLG: 30,
};