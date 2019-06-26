import * as appJson from '../../app';

const wsconnect =  (connectobj)  => ({type : appJson.websocket.connect,connectobj:connectobj});
const wsconnectClose =  ()  => ({ type : appJson.websocket.connectClose});
const connectSuccess =  ()  => ({ type : appJson.websocket.connectSuccess});
const connectFall =  ()  => ({ type : appJson.websocket.connectFail});
const sendmsg =  (sendmsg)  => ({ type : appJson.websocket.sendMsg,sendmsg:sendmsg});
const responseMsg =  (msgstr)  => ({ type : appJson.websocket.retureMsg,msgstr:msgstr});


export {
    wsconnect,
    wsconnectClose,
    connectSuccess,
    connectFall,
    sendmsg,
    responseMsg,
}