import React, { PureComponent } from 'react';
import {
  Text, View, StyleSheet, Image, Platform, TextInput, TouchableHighlight, TouchableOpacity, ListView,
  ImageBackground, FlatList, ActivityIndicator
} from 'react-native';

import {iosX,pxTodpWidth,pxTodpHeight,ScreenWidth,ScreenHeight,pix} from '../../../common/ScreenUtil'
import selectIcon from '../../../img/work/sort/select.png';
import unselectIcon from '../../../img/work/sort/unselect.png'
import PropTypes from "prop-types";
import type {Element} from "react";

let pageNo=1;

type Props = {
  data:PropTypes.array,//数据
  footView:Function | Element<any>,//加载显示
  onEndReached:Function,//加载
}

export default class SortFlatlist extends PureComponent<Props> {


  constructor(props) {
    super(props);
    this.state = {
      isRefresh:false,//是否刷新
      id:null,
    }
  }

  componentDidMount(){
    //传过来的值作为选中的
    this.props.extraData.map((item,i)=>{
      this.setState({id:item});
    });
  }

  render(){
    return  (
      <FlatList
        style={{marginHorizontal: pxTodpWidth(30)}}
        data={this.props.data}
        extraData={this.state}
        onRefresh={this._onRefresh}
        refreshing={this.state.isRefresh}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={this._ListEmptyComponent}
        ListFooterComponent={this.props.footView}
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={1}
        ItemSeparatorComponent={this._ItemSeparatorComponent}
      />
    )
  }

  _onRefresh = async() => {
    this.setState({isRefresh:true});
    await this.props.onRefresh();
    this.setState({isRefresh:false});
  }

  _keyExtractor = (item, index) => index;

  _onPress = (item) => {
    this.setState({id:item.id});
  }

  _renderItem = ({item}) => {
    return(
      <TouchableOpacity style={styles.container} onPress={this._onPress}>
        <Image source={!!this.state.selected.get(id)?selectIcon:unselectIcon}/>
        <Text style={{marginLeft:pxTodpWidth(20),fontSize:pxTodpWidth(32),color:'#333'}}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  _keyExtractor = ({item,index}) => index++;

  //行之间的分隔线
  _ItemSeparatorComponent(){
    return(
      <View style={{backgroundColor:'#dcdcdc',height:pxTodpHeight(1)}}/>
    )
  }

  _ListEmptyComponent = () =>{
    let cpt = (
      <View style={styles.emptyView}>
        <Text style={{color:'#999'}}>空空如也</Text>
      </View>
    )
    return cpt;
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width:pxTodpWidth(690),
    height:pxTodpHeight(104),
    backgroundColor:'#fff',
    alignItems: 'center',
  },

  emptyView:{
    flex:1,
    alignItems:'center',
    marginTop:pxTodpHeight(100)
  },
})
