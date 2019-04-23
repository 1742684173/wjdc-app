import React, {Component, Node} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
}from 'react-native';
import {pxTodpHeight,pxTodpWidth,ScreenWidth,ScreenHeight} from "./ScreenUtil";
import search from '../img/common/search.png';
import select from '../img/common/search_select.png';
import add from '../img/common/add.png';

type Props = {
  isShowSearchBefore?:boolean,//搜索放在前面还是后面
  onPreBtn?:Function,//搜索
  placeholder?:string,//提示
  isShowAdd?:boolean,//是否显示增加
  addSource?:string,//增加图标
  onAddBtn?:Function,//增加
  isShowSelect?:boolean,//是否显示筛选
  selectSource?:string,//
  onSelectBtn?:Function,
};

export default class Search extends Component<Props>{

  constructor(props){
    super(props);
    this.state = {
      value:'',
    }
  }

  clearSearchInput = () => {
    this.refs.searchInput.clear();
  }

  render(){
    const {
      isShowSearchBefore,//搜索放在前面还是后面
      onPreBtn,//搜索
      placeholder,//提示
      isShowAdd,//是否显示增加
      addSource,//
      onAddBtn,
      isShowSelect,//是否显示筛选
      selectSource,//
      onSelectBtn,
      ...other
    } = this.props;
    return(
        <View style={styles.contain}>
          <View style={styles.searchView}>
            {
              isShowSearchBefore?<TouchableOpacity onPress={()=>onPreBtn(this.state.value)}>
                <Image source={search} style={styles.searchImage}/>
              </TouchableOpacity>:null
            }

            <TextInput
              ref={'searchInput'}
              placeholder={placeholder}
              placeholderTextColor={'#999999'}
              returnKeyType={'search'}
              underlineColorAndroid={'#00000000'}
              onChangeText ={(text)=>this.setState({value:text})}
              style={styles.inputView}
              {...other}
            />

            {
              !isShowSearchBefore?<TouchableOpacity onPress={()=>onPreBtn(this.state.value)}>
                <Image source={search} style={styles.searchImage}/>
              </TouchableOpacity>:null
            }
          </View>
          {
            isShowAdd?<TouchableOpacity  onPress={onAddBtn} style={styles.addView}>
              <Image source={addSource?addSource:add} style={styles.addImage}/>
            </TouchableOpacity>:null
          }

          {
            isShowSelect?<TouchableOpacity  onPress={onSelectBtn} style={styles.addView}>
              <Image source={selectSource?selectSource:select} style={styles.addImage}/>
            </TouchableOpacity>:null
          }
        </View>
    )
  }

}

const styles = StyleSheet.create({
  contain:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#ffffff',
    paddingHorizontal:pxTodpWidth(30),
    paddingVertical:pxTodpHeight(12),
    //,
  },
  searchView:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#f2f2f2',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:pxTodpWidth(10),
    height:pxTodpHeight(70),
  },
  inputView:{
    flex:1,
    height:pxTodpHeight(90),
    marginHorizontal:pxTodpWidth(20),
    fontSize:pxTodpWidth(26),
  },
  searchImage:{
    height:pxTodpHeight(40),
    width:pxTodpWidth(40),
    marginRight:pxTodpWidth(10),
    marginLeft: pxTodpWidth(10),
    resizeMode :'contain',
  },
  addView:{
    alignItems:'center',
    justifyContent:'center',
    width:pxTodpWidth(88),
    height:pxTodpHeight(70),
    borderRadius:pxTodpWidth(10),
    borderWidth:1,
    borderColor:'#f2f2f2',
    marginLeft:pxTodpWidth(13),
  },
  addImage:{
    height:pxTodpHeight(30),
    width:pxTodpWidth(30),
    resizeMode :'contain',
  },
})