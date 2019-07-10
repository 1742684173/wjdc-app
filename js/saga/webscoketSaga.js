import { END} from 'redux-saga'
import { put , take, fork ,cancel ,cancelled,delay,call} from 'redux-saga/effects'
import * as appJson from '../../app';
import {connectSuccess, connectFall, responseMsg, sendMsg, wsconnect, wsconnectClose} from '../actions/websocketAction'
var protobuf = require("protobufjs");

/**
 * const action = yield take('login');
 * take这个方法，是用来监听action，返回的是监听到的action对象
 *
 * call(fn, ...args): yield call(fetch, '/userInfo',username)
 * call方法调用fn，参数为args，返回一个描述对象。不过这里call方法传入的函数fn可以是普通函数，也可以是generator。call方法应用很广泛，在redux-saga中使用异步请求等常用call方法来实现
 *
 * yield put({ type:'login' })
 * put这个Effect方法跟redux原始的dispatch相似，都是可以发出action，且发出的action都会被reducer监听到
 *
 * const state= yield select()；
 * put方法与redux中的dispatch相对应，同样的如果我们想在中间件中获取state，那么需要使用select。select方法对应的是redux中的getState，用户获取store中的state，
 *
 * fork
 * fork方法相当于web work，fork方法不会阻塞主线程，在非阻塞调用中十分有用。
 *
 * takeEvery和takeLatest
 takeEvery和takeLatest用于监听相应的动作并执行相应的方法，是构建在take和fork上面的高阶api，
 takeEvery('login', loginFunc);
 takeEvery监听到login的动作，就会执行loginFunc方法，除此之外，takeEvery可以同时监听到多个相同的action。
 takeLatest方法跟takeEvery是相同方式调用：
 takeLatest('login', loginFunc);
 与takeLatest不同的是，takeLatest是会监听执行最近的那个被触发的action。
 **/


var ws = null; // 缓存 websocket连接
var _mydispatch = null; // 这个变量是因为saga无法支持callback 只能变通处理（这也是个坑点）
var protpfile = null; // 缓存proto文件
var lockReconnect = false; // 避免重复连接
var isHandClose = false; //是否手动关闭

export function* watchWebsocket() {
    while (true){
        const action = yield take(appJson.websocket.connect);
        if(_mydispatch == null){
            _mydispatch = action.connectobj.mydispatch;
        }
        yield fork(connectWebsocket,_mydispatch);
        var sendmsgTask = yield fork(sendmsg);
        yield take(appJson.websocket.connectClose);
        yield fork(connectcolseWebsocket);
        yield cancel(sendmsgTask);
    }
}

function* sendmsg(){
    try{
        while (true){
            const sendaction = yield take(appJson.websocket.sendMsg);
            yield fork(decodeencodewithproto,sendaction.sendmsg.msgtext);

        }
    }finally {
        if(yield cancelled()){
            console.log("取消了监听发送任务");
        }
    }
}

function* decodeencodewithproto(sendstr) {
    let restroot ;
    if(protpfile == null){
        // 缓存proto 对象
        restroot = yield call(protobuffun);
        protpfile = restroot;
    }else{
        restroot = protpfile;
    }
    var AwesomeMessage = restroot.lookupType("awesomepackage.AwesomeMessage");
    var payload = { awesomeField: sendstr };
    var errMsg = AwesomeMessage.verify(payload);
    if (errMsg)
        throw Error(errMsg);
    // or use .fromObject if conversion is necessary
    var message = AwesomeMessage.create(payload);
    var buffer = AwesomeMessage.encode(message).finish();
    ws.send(buffer);
}


function protobuffun() {
    return new Promise(resolve => {
        //之所以要转成json 就是因为这个地方无法使用reload方法 只能用require方法
        var jsonDescriptor = require("./awesome.json"); // exemplary for node
        var root = protobuf.Root.fromJSON(jsonDescriptor);
        resolve(root);
    })
}


function* connectcolseWebsocket() {
    ws.close();
}

function* connectWebsocket(mydispatch) {
    console.log('connectWebsocket');
    ws = new WebSocket("ws://echo.websocket.org");

    ws.onopen = () => {
        console.log('onopen');
        heartCheck.reset().start();
        mydispatch(connectSuccess())
    };

    ws.onerror = e => {
        console.log('onerror');
        if(!lockReconnect){
            mydispatch(wsconnect());
            return;
        }
        mydispatch(connectFall())
    };

    ws.onmessage = e => {
        heartCheck.reset().start();
        console.log(e.data)
        var buf = new Uint8Array(e.data);
        var _AwesomeMessage = protpfile.lookupType("awesomepackage.AwesomeMessage");
        var message = _AwesomeMessage.decode(buf).awesomeField;
        console.log(message);
        mydispatch(responseMsg(message))
    };

    ws.onclose = e => {
        console.log('onclose');
        if(isHandClose) {
            console.log("手动关闭！");
            heartCheck.reset();//重置心跳
            isHandClose = false;
        } else {
            console.log("非手动关闭！");
            if(!lockReconnect){
                mydispatch(wsconnect());
            }
        }
        // mydispatch(connectFall())
    };
}

let heartCheck = {
    timeout: 3000,
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
            _mydispatch(sendMsg({msgtext:"protoBuf发送数111111"}))
            self.serverTimeoutObj = setTimeout(function(){
                _mydispatch(wsconnectClose());
            }, self.timeout)
        }, this.timeout)
    },
}