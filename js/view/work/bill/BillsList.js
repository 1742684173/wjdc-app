import React,{Component} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  DeviceEventEmitter,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import {pxTodpHeight, pxTodpWidth} from '../../../common/ScreenUtil';
import PropTypes from 'prop-types';
import RankImage from "../../../common/RankImage";

import syyg_s_on_img from '../../../../js/img/home/21_icon_4.png';
import syyg_x_on_img from '../../../../js/img/home/21_icon_41.png';

import x_off_img from '../../../../js/img/home/21_icon_5.png';
import s_off_img from '../../../../js/img/home/21_icon_51.png';

import sryg_s_on_img from '../../../../js/img/home/21_icon_6.png';
import sryg_x_on_img from '../../../../js/img/home/21_icon_61.png';
import nullDataIcon from "../../../img/common/31_pic_2.png";

const propery = ['id','method','sort','sums','dates'];

const title = ['序号','消费方式','消费分类','消费金额(元)','消费日期'];

export default class BillsList extends Component{
  static propTypes = {
    data:PropTypes.any,//传入的数据
    onRefresh:PropTypes.func,//刷新数据
  }

  constructor(props){
    super(props);
    this.state = {
      isRefresh:false,
      whichSelect:-1,//根据哪个字段排序
      isDesc:true,//是否是降序
      data:[],
    }
  }

  _onRefresh = async() => {
    this.setState({isRefresh:true,whichSelect:-1});
    await this.props.onRefresh();
    this.setState({isRefresh:false});
  }

  //根据字段排序
  _orderByName = async (which) => {
    await this.setState({
      whichSelect:which,
      isDesc:which===this.state.whichSelect?!this.state.isDesc:true,
    });
    let sortName = propery[which-1]+(this.state.isDesc?' desc':'');
    this.props.orderByName(sortName);
  }

  componentWillReceiveProps(nextProps){
    this.setState({data:this.props.data});
  }

  _onMomentumScrollEnd = (self)=> {
    var offSetY = self.nativeEvent.contentOffset.y;  //获取滑动的距离
    var contentSizeHeight = self.nativeEvent.contentSize.height; //scrollView  contentSize 高度
    var oriageScrollHeight = self.nativeEvent.layoutMeasurement.height; //scrollView高度

    if (offSetY + oriageScrollHeight >= contentSizeHeight) {
      //加载显示
      this.props.onEndReached();
    }
  }

  render(){
    return this.props.data.length===0?this._ListEmptyComponent():
      <ScrollView
        style={{
          width:pxTodpWidth(690),
          //paddingBottom:pxTodpWidth(10),
        }}
        stickyHeaderIndices={[0]}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this._onRefresh}
          />
        }
      >
        {this._ListHeaderComponent()}

        <ScrollView
          style={{flex:1,width:pxTodpWidth(690),borderRadius:pxTodpWidth(20)}}
          bounces={false}
        >
          <View style={{flex:1,flexDirection:'row'}}>
            <FlatList
              data={this.state.data}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderLeftItem}
              scrollEnabled={false}
              bounces={false}
            />
            <View style={{width:pxTodpWidth(690-180)}}>
              <ScrollView
                style={{flex:1}}
                horizontal={true}
                ref={(right)=>this.rightList = right}
                onScroll={this._rightOnScroll}
                scrollEventThrottle={20}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <FlatList
                  ref={'rightItemList'}
                  extraData={this.state}
                  data={this.state.data}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderRightItem}
                  scrollEnabled={false}
                />
              </ScrollView>
            </View>
          </View>

        </ScrollView>

        <View style={{flexDirection:'row',marginTop:pxTodpHeight(30), width:pxTodpWidth(690), justifyContent:'center',}}>
          <ActivityIndicator animating={this.props.foot===2}/>
          <Text style={{color:'#333',fontSize:pxTodpWidth(24)}}>
            {this.props.foot===0?'上拉加载':(this.props.foot===2?'正在加载中...':this.props.foot===1?'没有更多数据了':'')}
          </Text>
        </View>

      </ScrollView>

  }

  _leftScroll = (self)=> {
    var x = self.nativeEvent.contentOffset.x;
    if (Platform.OS==='ios') {
      this.rightList.setNativeProps({
        contentOffset: {x: x, y: 0, animated: false}
      })
    }
    // else {
    //   this.rightList.scrollTo({x: x, y: 0, animated: false})
    // }
  }

  _rightOnScroll = (self)=> {
    var x = self.nativeEvent.contentOffset.x;
    if (Platform.OS==='ios') {
      this.leftList.setNativeProps({
        contentOffset: {x: x, y: 0, animated: false}
      })
    }else {
      this.leftList.scrollTo({x: x, y: 0, animated: false})
    }
  }

  _renderLeftItem = ({item,index}) => {
    let view = null;
    switch (this.props.which) {
      case 1:break;
      case 2:break;
      case 3:
        view = (
          <View style={[styles.itemView,{
            backgroundColor:index%2===0?'#F4FCFF':'#ffffff',
            borderBottomRightRadius:pxTodpWidth(10),
          }]}>

            <View style={[styles.titleItemView,{width:pxTodpWidth(40)}]}>
              <RankImage style={{width:pxTodpWidth(30), borderRadius:pxTodpWidth(25),
                height:index<=2?pxTodpHeight(45):pxTodpHeight(30)}} number={index+1}/>
            </View>

            {/*营业部*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={styles.contentFont}>{item.Byyj_YYB}</Text>
            </View>

          </View>
        );
        break;
      case 4:view = (
        <View style={[styles.itemView,{
          backgroundColor:index%2===0?'#FFF9F3':'#ffffff',
          borderBottomRightRadius:pxTodpWidth(10),
        }]}>

          <View style={[styles.titleItemView,{width:pxTodpWidth(40)}]}>
            <RankImage style={{width:pxTodpWidth(30), borderRadius:pxTodpWidth(25),
              height:index<=2?pxTodpHeight(45):pxTodpHeight(30)}} number={index+1}/>
          </View>

          {/*营业部*/}
          <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
            <Text style={styles.contentFont}>{item.Bnyj_YYB}</Text>
          </View>

        </View>
      );
      break;
    }

    return view;
  }

  _renderRightItem = ({item,index}) => {
    let view = null;
    switch (this.props.which) {
      case 1:break;
      case 2:break;
      case 3:
        view = (
          <View style={[styles.itemView,{backgroundColor:index%2===0?'#F4FCFF':'#ffffff', borderBottomLeftRadius:pxTodpWidth(10),}]}>

            {/*日均权益*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={styles.contentFont}>{item.Byyj_RJQY}</Text>
            </View>

            {/*市场份额*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Byyj_SCFE}</Text>
            </View>

            {/*新开户数*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Byyj_XKHS}</Text>
            </View>

            {/*手续费*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Byyj_SXF}</Text>
            </View>

            {/*出入金*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Byyj_CRJ}</Text>
            </View>
          </View>
        );
        break;
      case 4:
        view = (
          <View style={[styles.itemView,{backgroundColor:index%2===0?'#FFF9F3':'#ffffff', borderBottomLeftRadius:pxTodpWidth(10),}]}>

            {/*日均权益*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={styles.contentFont}>{item.Bnyj_RJQY}</Text>
            </View>

            {/*市场份额*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Bnyj_SCFE}</Text>
            </View>

            {/*新开户数*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Bnyj_XKHS}</Text>
            </View>

            {/*手续费*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Bnyj_SXF}</Text>
            </View>

            {/*出入金*/}
            <View style={[styles.titleItemView,{width:pxTodpWidth(140)}]}>
              <Text style={[styles.contentFont]}>{item.Bnyj_CRJ}</Text>
            </View>
          </View>
        );
        break;
    }
    return view;
  }

  _ListHeaderComponent = () => {
    let textView = null;

    let texts,units,color='#21c3fe';

    return (
      <View style={[styles.titleView, {backgroundColor:'#E6F8FF', borderTopLeftRadius:pxTodpWidth(10),borderTopRightRadius:pxTodpWidth(10)}]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          automaticallyAdjustContentInsets={false}
          onScroll={this._leftScroll}
          ref={(left)=>this.leftList = left}
          scrollEventThrottle={20}
          scrollEnabled={Platform.OS==='ios'?true:this.props.data.length===0?true:false}
        >
          {
            texts.map((item, i)=> {
              return (
                <TouchableOpacity key={i} onPress={()=>this._orderByName(i)} style={[styles.titleItemView,{width:i===0?pxTodpWidth(180):pxTodpWidth(140)}]}>
                  {
                    i===0?null:(
                      <View>
                        <Text style={[styles.titleFont,{color:'#333333',}]}>
                          {item}
                        </Text>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                          <Text style={[styles.unitFont]}>({units[i]})</Text>
                          {
                            this.state.isDesc?
                              <View style={{alignItems:'center',justifyContent:'space-around'}}>
                                <Image source={this.state.whichSelect===i?(this.props.which%2!=0?sryg_s_on_img:syyg_s_on_img):s_off_img}/>
                                <Image source={!this.state.whichSelect===i?(this.props.which%2!=0?sryg_x_on_img:syyg_x_on_img):x_off_img}/>
                              </View>
                              :
                              <View style={{alignItems:'center',justifyContent:'space-around'}}>
                                <Image source={!this.state.whichSelect===i?(this.props.which%2!=0?sryg_s_on_img:syyg_s_on_img):s_off_img}/>
                                <Image source={this.state.whichSelect===i?(this.props.which%2!=0?sryg_x_on_img:syyg_x_on_img):x_off_img}/>
                              </View>
                          }
                        </View>
                      </View>
                    )
                  }

                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
        <View style={{
          width:pxTodpWidth(180),
          height:pxTodpHeight(70),
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'#E6F8FF',
          borderTopLeftRadius:pxTodpWidth(10),
          left:0,
          position:'absolute'
        }}>
          <Text style={styles.titleFont}>{texts[0]}</Text>
        </View>
      </View>
    )

  );
  }

  _keyExtractor = (item, index) => index++;

  _ListEmptyComponent = () =>{
    let cpt = (
      <View style={styles.emptyView}>
        <Image source={nullDataIcon} style={{height:pxTodpHeight(210),width:pxTodpWidth(364),resizeMode:'contain',}}/>
        <Text style={{color:'#999'}}>空空如也~</Text>
      </View>
    )
    return cpt;
  }

}

const styles = StyleSheet.create({
  emptyView:{
    marginTop:pxTodpHeight(100),
    alignItems:'center'
  },
  titleView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height:pxTodpHeight(70),
  },
  titleItemView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  titleFont:{
    color:'#333333',
    fontSize:pxTodpWidth(26),
    textAlign:'center'
  },
  unitFont:{
    color:'#999999',
    fontSize:pxTodpWidth(24),
    textAlign:'center'
  },
  contentFont:{
    color:'#666666',
    fontSize:pxTodpWidth(26),
    textAlign:'center'
  },
  itemView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height:pxTodpHeight(62),
  }
})