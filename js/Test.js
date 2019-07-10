// import React,{Component} from 'react';
// import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
// import {connect} from 'react-redux';
// import Button from "./view/common/Button";
// import * as action from './actions'
// import {
//     wsconnect,
//     wsconnectClose,
//     connectSuccess,
//     connectFall,
//     sendMsg,
//     responseMsg,
// } from './actions/websocketAction'
// import WebsocketReducer from "./reducers/webscoketReducer";
//
// let ws = null;
//
// class Test extends Component{
//
//     _onConnect(){
//         this.props.dispatch(wsconnect({mydispatch: this.props.dispatch}));
//     }
//
//     _onConnectclose(){
//         this.props.dispatch(wsconnectClose());
//     }
//
//     _onsendmsg(){
//         // 随便发送点数据
//         this.props.dispatch(sendMsg({msgtext:"protoBuf发送数:"+ Math.round(Math.random()*100)}));
//     }
//
//     render(){
//         return (
//             <View style={styles.container}>
//                 {/*<Text style={styles.counter}>{this.props.WebsocketReducer.status}</Text>*/}
//                 <TouchableOpacity style={styles.reset} onPress={()=>this._onConnect()}>
//                     <Text>连接websocket</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.start} onPress={()=>this._onConnectclose()}>
//                     <Text>断开连接</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.stop} onPress={()=>this._onsendmsg()}>
//                     <Text>发送消息</Text>
//                 </TouchableOpacity>
//                 {/*<Text style={styles.counter}>{this.props.WebsocketReducer.msg}</Text>*/}
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column'
//     },
//     counter: {
//         fontSize: 50,
//         marginBottom: 70
//     },
//     reset: {
//         margin: 10,
//         backgroundColor: 'yellow'
//     },
//     start: {
//         margin: 10,
//         backgroundColor: 'yellow'
//     },
//     stop: {
//         margin: 10,
//         backgroundColor: 'yellow'
//     }
// })
//
// const mapStateToProps = state => ({
//     WebsocketReducer:state.websocketReducer
// })
//
// export default connect(mapStateToProps)(Test)

import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    SwipeableFlatList,//侧滑列表
} from 'react-native';



export default class FlatListDemo extends Component<Props> {
    static navigationOptions = {
        title: 'SwipeableFlatList',
    };

    state = {
        citys:['北京', '上海', '广州','杭州', '苏州']
    }

    _onPress = (item) => {

        this.setState({citys:['北京', '广州','杭州', '苏州']})
    }

    //侧滑菜单渲染
    getQuickActions=(item)=>{
        return <View style={styles.quickAContent}>
            <TouchableHighlight onPress={()=>this._onPress(item)}
            >
                <View style={styles.quick}>
                    <Text style={styles.delete}>删除</Text>
                </View>
            </TouchableHighlight>
        </View>
    };
    render() {
        return (
            <View style={styles.container}>
                <SwipeableFlatList
                    //1数据的获取和渲染
                    extraData={{
                        ...this.state,
                        ...this.props.extraData
                    }}
                    data={this.state.citys}
                    renderItem={(data) =>   <View style={styles.item}>
                        <Text style={styles.text}>{data.item}</Text>
                    </View>}

                    //2创建侧滑菜单
                    renderQuickActions={this.getQuickActions}//创建侧滑菜单
                    maxSwipeDistance={80}//可展开（滑动）的距离
                    // bounceFirstRowOnMount={false}//进去的时候不展示侧滑效果
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: '#aeffb1',
        height: 100,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation:5,//漂浮的效果
        borderRadius:5,//圆角
    },
    text: {
        color: '#444444',
        fontSize: 20,
    },
    //侧滑菜单的样式
    quickAContent:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
        marginRight:15,
        marginBottom:10,
    },
    quick:{
        backgroundColor:"#ff1d49",
        flex:1,
        alignItems:'flex-end',//水平靠右
        justifyContent:'center',//上下居中
        width:100,
        borderRadius:5,
        elevation:5,//漂浮的效果

    },
    delete:{
        color:"#d8fffa",
        marginRight:30
    }
});
