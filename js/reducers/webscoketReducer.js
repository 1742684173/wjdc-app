
const initwsState ={
    status:'未连接',
    isSuccess:false,
    ws:null,
    msg:""
}

export default function webSockerfun(state=initwsState,action) {
    return state;
    // switch (action.type){
    //     case types.CONNECTSUCCESS:
    //         return{
    //             ...state,
    //             status:"连接成功",
    //         }
    //         break;
    //     case types.CONNECTFALL:
    //         return{
    //             ...state,
    //             status:"未连接",
    //             msg:""
    //         }
    //         break;
    //     case types.RETURNMSG:
    //         return{
    //             ...state,
    //             msg:action.msgstr
    //         }
    //         break;
    //     default:
    //         return state;
    // }
}