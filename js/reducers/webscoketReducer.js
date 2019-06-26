import * as appJson from '../../app';

const initwsState ={
    status:'未连接',
    isSuccess:false,
    ws:null,
    msg:""
}

export default function webSockerfun(state=initwsState,action) {
    return state;
    switch (action.type){
        case appJson.websocket.connectSuccess:
            return{
                ...state,
                status:"连接成功",
            }
            break;
        case appJson.websocket.connectFail:
            return{
                ...state,
                status:"未连接",
                msg:""
            }
            break;
        case appJson.websocket.retureMsg:
            return{
                ...state,
                msg:action.msgstr
            }
            break;
        default:
            return state;
    }
}