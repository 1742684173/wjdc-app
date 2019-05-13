import React, {Component, Node} from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {pxTodpHeight, pxTodpWidth} from "./ScreenUtil";
import Toast from 'react-native-root-toast';

type Props = {

}

export default class MyLoad extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            flag:1000,
            content:'加载中',
        }
        this.toast = null;
    }

    /**
     *
     * /
     **/
    showAlert(value:{
        title?:string,content:string,
        cancel?:Function,confirm?:Function,
        cancelText?:string,confirmText?:string
    }){
        this.setState({flag:1});
        const {title,content,cancel,confirm,cancelText,confirmText} = value;

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

    showActivityIndicator(content?:string){
        this.setState({content:content?content:'加载中',flag:0});
    }

    hideActivityIndicator(){
        this.setState({flag:1000});
    }

    showToast(content:string,time?:number){
        this.setState({flag:2});
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

    _renderAlert(){

    }

    _onShow = () => {

    }

    _onDismiss = () => {

    }

    renderActivityIndicator(){
        return(
            <View style={styles.contain}>
                <ActivityIndicator size="large" color="#333"/>
                <Text style={{marginTop:10,color:'#333',fontSize:15}}>
                    {this.content}
                </Text>
            </View>
        )
    }

    render(){
        let view = null;
        switch (this.state.flag) {
            case 0:view = this.renderActivityIndicator();break;
            case 1:
            case 2:view = null;break;
            default:view=null;break;
        }
        return view;
    }
}

const styles = StyleSheet.create({
    contain:{
        position:'absolute',
        top:0,left:0,right:0,bottom:0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#00000000'
    },
    btn:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})