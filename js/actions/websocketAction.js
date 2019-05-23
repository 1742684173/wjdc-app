import {websocktUrl} from '../env';
import * as actionType from './actionType';
import {encrypt} from "../utils/ToolUtil";

let lockReconnect = false; // 避免重复连接
let isHandClose = false; //是否手动关闭

let myDispatch = null;
let ws = null;
let id = null;
let flag = 0;

export const connWebsocket = (data) => {
    id = data;

    return (dispatch,ownProps)=>{
        myDispatch = dispatch;
        myconnect();
    }
}

// 连接
const myconnect = () => {
    console.log('websocket-----------myconnect');
    let url = websocktUrl+id+'?key='+encodeURIComponent(encodeURIComponent(encrypt(id)));

    if(ws === null){
        ws = new WebSocket(url);
    }

    init();

}

const init = () => {
    ws.onopen = () => {
        console.log('websocket------》己打开');
        heartCheck.reset().start();
        myDispatch({type:actionType.WEBSOCKET_CONNECTING});
    }

    ws.onmessage = (e) => {
        console.log('websocket------》接收到消息'+e.data);
        heartCheck.reset().start();
        try{
            let message = JSON.parse(e.data.substring(1,e.data.length-1));
            //i_nFslx：1单发 2 群发 3 多用户踢出  4  给发送用户返回输入的字符串
            if(message.i_nFslx === 1 || message.i_nFslx === 2){
                myDispatch({
                    type:actionType.WEBSOCKET_RECEIVE_MESSAGE,
                    isNewMessage:flag ++ +"",
                    // message:JSON.parse(e.data.substring(1,e.data.length-1)),
                });
            }else if(message.i_nFslx === 3){//

            }
        }catch (e) {

        }

    };

    ws.onerror = (e) => {
        console.log('websocket------》错误'+e.message);
        if(!lockReconnect){
            reconnect();
        }
        myDispatch({type:actionType.WEBSOCKET_ERROR});
    };

    ws.onclose = (e) => {
        console.log('websocket------》onclose');
        //判断是否是手动关闭
        if(isHandClose) {
            console.log("手动关闭！");
            heartCheck.reset();//重置心跳
            isHandClose = false;
        } else {
            console.log("非手动关闭！");
            if(!lockReconnect){
                reconnect();
            }

        }

    };
}

//重连
const reconnect = () => {
    console.log("--------reconnect---------"+lockReconnect);
    if(lockReconnect){
        return;
    }

    lockReconnect = true;
    // 没连接上会一直重连，设置延迟避免请求过多

    setTimeout(() => {
        console.log("--------1111---------");
        lockReconnect = false;
        ws = null;
        myconnect();
    }, 2000);
}

//手动断开连接
export const disconnect = () => {
    console.log("--------disconnect---------");
    isHandClose = true;
    if(ws && ws.readyState === 1) {
        ws.close();
    }
    ws = null;
    return {type:actionType.WEBSOCKET_DISCONNECT};
}

//发送信息
export const send = (data) => {
    console.log('发送的消息是：'+JSON.stringify(data));
    try{
        console.log("--------send---------:"+ws.readyState);
        ws.send(JSON.stringify(data));
    }catch (e) {
        return {type:actionType.WEBSOCKET_CLOSE};
    }finally {
        return {type:actionType.WEBSOCKET_SEND_MESSAGE,isNewMessage:true};
    }

}

let heartCheck = {
    timeout: 30000,
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            ws.send('[{"i_nFslx":4}]');
            self.serverTimeoutObj = setTimeout(function(){
                ws.close();
            }, self.timeout)
        }, this.timeout)
    },
}