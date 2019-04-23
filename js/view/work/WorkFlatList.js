import React,{Component} from 'react';
import {FlatList,StyleSheet,View,Text,TouchableOpacity,Image} from 'react-native';
import {pxTodpHeight, pxTodpWidth} from '../../common/ScreenUtil';

export default class WorkFlatList extends Component{

  //去事件详情界面
  _goDetail = (item) => {
    this.props.onItemClick(item);
  }

  render(){
    return(
      <FlatList
        data={this.props.data}
        horizontal={false}
        numColumns={4}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this._ItemSeparatorComponent}
      />
    );
  }

  _keyExtractor = (item, index) => index+++'';

  _renderItem = ({item}) => {

    return (
      <TouchableOpacity onPress={()=>this._goDetail(item)}>

        <View style={styles.itemView}>
          <Image source={item.pic}/>
          <Text style={{color:'#666',fontSize:pxTodpWidth(30),marginTop:pxTodpHeight(10)}}>
            {item.title}
          </Text>
        </View>

      </TouchableOpacity>
    );
  }

  //行之间的分隔线
  _ItemSeparatorComponent(){
    return(
      <View style={{height:pxTodpHeight(24),}}/>
    )
  }

}

const styles = StyleSheet.create({
  itemView:{
    width:pxTodpWidth(150),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffffff',
    paddingVertical:pxTodpHeight(20),
    paddingHorizontal:pxTodpWidth(20),
    borderRadius:pxTodpWidth(20),
    marginLeft:pxTodpWidth(30),
    marginTop:pxTodpHeight(10),
  },

})