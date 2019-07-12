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
    SafeAreaView, KeyboardAvoidingView,
} from 'react-native';
import Toast from 'react-native-root-toast';
import backImg from '../../img/common/back-icon.png';
import MessageButton from '../MessageButton';
import MyDialog from '../common/MyDialog';
import * as appJson from '../../../app';
import Orientation from 'react-native-orientation';
import {pxTodpHeight, pxTodpWidth} from "../../utils/ScreenUtil";

export default class BaseComponent extends Component<any> {

    state = {
        orientation:'portrait',//landscape：竖屏 portrait：横屏
        netStatus:0,//none：离线状态 cellular:通过蜂窝数据流量联网 wifi:通过wifi联网 unknown:联网状态异常
        dialogType:'load',//load alert others
        isDialogVisible:false,//是否显示加载框
        dialogTitle:'信息提示',//加载框提示
        dialogContent:null,//当dialogType为alert时是字符串，当是others时是相关控件
        dialogButtons:[],//{text:'',onPress:()=>{}}
        dialogOnRequestClose:()=>{},//modal返回监听
        dialogOnShowClose:()=>{}//modal显示之前调用
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            headerLeft:params && params.leftView?params.leftView:(
                <TouchableOpacity
                    onPress={params?()=>params.goBack():null}
                    style={{width:pxTodpWidth(100),paddingLeft:pxTodpWidth(30)}}>
                    <Image source={backImg}/>
                </TouchableOpacity>
            ),
            title: params?params.title:'',
            headerRight:params && params.rightView?params.rightView:<MessageButton/>,
        }
    };

    constructor(props){
        super(props);
        this.toast = null;
        this.props.navigation.setParams({goBack:this._goBack});

    }

    initBase = async () => {
        await this.setState({
            orientation:'portrait',
            netStatus:'none',//none：离线状态 cellular:通过蜂窝数据流量联网 wifi:通过wifi联网 unknown:联网状态异常
            dialogType:'load',//load alert others
            isDialogVisible:false,//是否显示加载框
            dialogTitle:'信息提示',//加载框提示
            dialogContent:null,//当dialogType为alert时是字符串，当是others时是相关控件
            dialogButtons:[],//{text:'',onPress:()=>{}}
            dialogOnRequestClose:()=>{},//modal返回监听
            dialogOnShowClose:()=>{}//modal显示之前调用
        });
        console.log('this.state----------->'+JSON.stringify(this.state));
    }

    componentDidMount(){
        NetInfo.getConnectionInfo().done(status=> this.setState({netStatus:status}));
        //监听网络状态改变
        NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
        //监听横竖屏
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillUnMount(){
        NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    _signOut = async () => {
        await this.showActivityIndicator();
        try{
            await this.props.postAction(appJson.action.signOut,{},'登出');
        }catch (e) {

        }
        await this.hideActivityIndicator();
        this.props.navigation.navigate('SignIn');
    }

    //处理请求的错误
    handleRequestError = async (obj:Object) => {
        const {code,msg} = obj;
        switch (code) {
            //会话错误
            case appJson.action.sessionError:
                this.showAlert({
                    title:'信息提示', content:msg,
                    buttons:[{text: '确认', onPress:this._signOut},]
                })
                break;

            //连接错误
            case appJson.action.connectServerError:
                this.showAlert({
                    title:'信息提示', content:msg,
                    buttons:[{text: '确认', onPress:this.hideActivityIndicator}]
                });
                break;

            default:
                this.showToast(JSON.stringify(obj));
                break;

        }
    }

    renderBase(view){

        return (
            <SafeAreaView style={{flex:1}}>
                <View style={styles.contain}>
                    <MyDialog
                        type={this.state.dialogType}
                        visible={this.state.isDialogVisible}
                        title={this.state.dialogTitle}
                        content={this.state.dialogContent}
                        buttons={this.state.dialogButtons}
                        onRequestClose={this.state.dialogOnRequestClose}
                        onShow={this.state.dialogOnShow}
                    />
                    {
                        //断网显示
                        this.renderDisNet()
                    }

                    {view}

                </View>
            </SafeAreaView>
        );
    }

    render(){
        return null;
    }

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

    //处理网络
    handleConnectivityChange = (connectionInfo) => {
        console.log('网络类型：'+connectionInfo.type)
        this.setState({netStatus:connectionInfo.type});
    }

    //显示提示
    showToast = async (content:string,time?:number) => {
        await this.hideActivityIndicator();

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

    //显示加载
    showActivityIndicator = async (content?:string) => {
        if(!this.state.isDialogVisible){
            await this.setState({
                dialogType:'load',
                isDialogVisible:true,
                dialogTitle:content?content:'正在加载中'
            })
        }

    }

    //隐蔽加载
    hideActivityIndicator = async () => {
        await this.setState({
            dialogType:'load',//load alert others
            isDialogVisible:false,//是否显示加载框
            dialogTitle:'信息提示',//加载框提示
            dialogContent:null,//当dialogType为alert时是字符串，当是others时是相关控件
            dialogButtons:[],//{text:'',onPress:()=>{}}
            dialogOnRequestClose:()=>{},//modal返回监听
            dialogOnShowClose:()=>{}//modal显示之前调用
        });
    }

    //显示alert
    showAlert = async (obj:{title?:string,content:string,buttons?:Array}) => {
        await this.setState({
            dialogType:'alert',
            isDialogVisible:true,
            dialogTitle:obj.title?obj.title:'信息提示',
            dialogContent:obj.content,
            dialogButtons:obj.buttons.length?obj.buttons:[],
        })
    }

    //显示alert
    showSelectAlert = async (obj:{title?:string,content?:string,buttons?:Array}) => {
        await this.setState({
            dialogType:'selectAlert',
            isDialogVisible:true,
            dialogTitle:obj.title,
            dialogContent:obj.content,
            dialogButtons:obj.buttons.length?obj.buttons:[],
        })
    }

    hideAlert = async () => {
        await this.setState({
            dialogType:'load',//load alert others
            isDialogVisible:false,//是否显示加载框
            dialogTitle:'信息提示',//加载框提示
            dialogContent:null,//当dialogType为alert时是字符串，当是others时是相关控件
            dialogButtons:[],//{text:'',onPress:()=>{}}
            dialogOnRequestClose:()=>{},//modal返回监听
            dialogOnShowClose:()=>{}//modal显示之前调用
        });
    }

    //网络异常显示
    renderDisNet(){
        return this.state.netStatus === 'none' || this.state.netStatus === 'unknown'?(
            <View style={styles.containDisNet}>
                <Text style={{fontSize:pxTodpWidth(30),color:'#999'}}>
                    {this.state.netStatus === 'none'?'网络己断开':'联网状态异常'}
                </Text>
            </View>
        ):null
    }

    hideTopView(){
        this.setState({isShowSearch:false});
    }

    showTopView(){
        this.setState({isShowSearch:true});
    }

    _orientationDidChange = (orientation) => {
        console.log('----'+orientation);
        if (orientation === 'LANDSCAPE') {
            this.setState({orientation:'portrait'});
        } else if (orientation === 'PORTRAIT') {
            this.setState({orientation:'portrait'});
        } else if (orientation === 'PORTRAITUPSIDEDOWN') {
            this.setState({orientation:'portrait_up_side_down'});
        }else{
            this.setState({orientation:'UNKNOWN'});
        }
    }

    //竖屏
    setLockToPortrait(){
        Orientation.lockToPortrait();
    }

    //横屏
    setLockToLandscape(){
        Orientation.lockToLandscape();
    }
}

const styles = StyleSheet.create({
    contain:{
        flex:1,
        backgroundColor:'#f2f2f2'
    },
    containActivityIndicator:{
        position:'absolute',
        top:-pxTodpHeight(60),left:0,right:0,bottom:0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#00000000'
    },
    containDisNet:{
        height: pxTodpHeight(80),
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor:'#fcdaa6'
    }
});

