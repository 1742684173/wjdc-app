import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  NetInfo,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {pxTodpHeight, pxTodpWidth,md5} from "../../common/ScreenUtil";
import Toast from "react-native-root-toast";
import backImg from '../../img/common/back-icon.png';
import Search from "../../common/Search";

let myparams= {
  currentPage:0,
  pageSize:10,
  sortName:null,
  condition:null
};

export default class BaseComponent extends Component<any> {

  state = {
    netStatus:0,//none：离线状态 cellular:备通过蜂窝数据流量联网 wifi:通过wifi联网 unknown:联网状态异常
    isShowActivityIndicator:false,//是否显示加载
    showActivityIndicatorTitle:'正在加载中',
    data:[],//获取的数据
    isShowSearchView:false,//是否显示搜索框
  }

  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
    return {
      headerLeft:(
        <TouchableOpacity
          onPress={params?()=>params.goBack():null}
          style={{width:pxTodpWidth(100),paddingLeft:pxTodpWidth(30)}}>
          <Image source={backImg}/>
        </TouchableOpacity>
      ),
      title: params?params.title:'',
      headerRight:<View/>,
    }
  };

  //返回
  _goBack = () => {
    this.props.navigation.state?(this.props.navigation.state.params?(
      this.props.navigation.state.params.callback?
        this.props.navigation.state.params.callback({}):null
    ):null):null;
    this.props.navigation.goBack();
  }

  //设置标题
  setTitle = (title:string) => {
    this.props.navigation.setParams({title: title});
  }

  constructor(props){
    super(props);
    this.toast = null;
    this.props.navigation.setParams({goBack:this._goBack});
    this.currentPage = 0;//当前页
    this.totalPage = 0;//总页数
    this.pageSize = 0;//每页记录
  }

  componentDidMount(){
    NetInfo.getConnectionInfo().done(status=> this.setState({netStatus:status}));
    //监听网络状态改变
    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnMount(){
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (connectionInfo) => {
    console.log('网络类型：'+connectionInfo.type)
    this.setState({netStatus:connectionInfo.type});
  }

  showActivityIndicator = async (content?:string) => {
    await this.setState({
      isShowActivityIndicator:true,
      showActivityIndicatorTitle:content?content:'正在加载中'
    })
  }

  hideActivityIndicator = async () => {
    await this.setState({
      isShowActivityIndicator:false,
      showActivityIndicatorTitle:'正在加载中'
    })
  }

  showToast(content:string,time?:number) {
    this.hideActivityIndicator();

    if (this.toast !== null) {
      Toast.hide(this.toast);
    }
    if(content !== undefined){
      this.toast = Toast.show(content, {
        duration: time?time:Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
      });
    }
  }

  showAlert(value:{ title?:string,content:string, cancel?:Function,confirm?:Function, cancelText?:string,confirmText?:string }){
    const {title,content,cancel,confirm,cancelText,confirmText} = value;
    this.hideActivityIndicator();
    Alert.alert(
      title?title:'信息提示',
      content,
      [
        //{text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: cancelText?cancelText:'取消', onPress:cancel, style: 'cancel'},
        {text: confirmText?confirmText:'确认', onPress:confirm},
      ],
      { cancelable: false }
    )
  }

  //显示加载
  renderActivityIndicator(){
    let view = this.state.isShowActivityIndicator?(
      <View style={styles.containActivityIndicator}>
        <ActivityIndicator size="large" color="#333"/>
        <Text style={{marginTop:10,color:'#333',fontSize:15}}>
          {this.state.showActivityIndicatorTitle}
        </Text>
      </View>
    ):null;
    return view;
  }

  //网络异常显示
  renderDisNet(){
    return this.state.netStatus === 'none' || this.state.netStatus === 'unknown'?(
      <View style={styles.containDisNet}>
        <Text style={{marginTop:pxTodpHeight(96),fontSize:pxTodpWidth(30),color:'#999'}}>
          {this.state.netStatus === 'none'?'网络己断开':'联网状态异常'}
        </Text>
      </View>
    ):null
  }

  hideSearchView(){
    this.setState({isShowSearch:false});
  }

  renderSearchView = (value:{
    isShowSearchBefore?:boolean,//是否显示搜索按钮
    onSearchBtn?:Function,//搜索按涵数
    isShowAdd?:boolean,
    onAddBtn?:Function,
    isShowSelect?:boolean,
    onSelectBtn?:Function,
  }) => {
    return this.state.isShowSearch?(
      <View style={{backgroundColor:'#ffffff',marginBottom: pxTodpHeight(10)}}>
        <Search
          ref={'search'}
          placeholder={'请输入关键字'}
          onPreBtn={onSearchBtn?onSearchBtn:null}
          isShowSearchBefore={isShowSearchBefore?isShowSearchBefore:true}
          isShowAdd={isShowAdd?isShowAdd:false}
          isShowSelect={isShowSelect?isShowSelect:false}
          onAddBtn={onAddBtn?onAddBtn:null}
          onSelectBtn={onSelectBtn?onSelectBtn:null}
        />
      </View>
    ):null
  }

  renderBase(view){
    return (
      <SafeAreaView style={{flex:1}}>
        <View
          style={styles.contain}
          keyboardShouldPersistTaps={'handled'}
          stickyHeaderIndices={[0]}
        >
          {
            //断网显示
            this.renderDisNet()
          }

          {
            this.renderSearchView()
          }

          {
            view
          }

          {
            //加载框显示
            this.renderActivityIndicator()
          }
        </View>
      </SafeAreaView>
    );
  }

  render(){
    return null;
  }
}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    backgroundColor:'#f2f2f2'
  },
  containActivityIndicator:{
    position:'absolute',
    top:0,left:0,right:0,bottom:0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#00000000'
  },
  containDisNet:{
    height: pxTodpHeight(80),
    alignItems: 'center',
    backgroundColor:'#fcdaa6'
  }
});