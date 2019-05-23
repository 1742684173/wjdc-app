import {AsyncStorage,} from 'react-native';
import FetchUtil from '../utils/FetchUtil';
import {md5} from "../utils/ToolUtil";
import * as appJson from '../../app.json';


let fetchUtil = new FetchUtil();

/**
 *
 * @param actionType 功能码
 * @param object 入参
 * @param desc 功能描述
 * @param bodyType 默认json
 * @returns {Promise<*>}
 */
export const postAction  = async (actionType:string,object:Object,desc?:string,bodyType?:string) =>{
    let result = {type:actionType};
    console.log((desc?desc:'')+'actionType：'+actionType);

    //
    let token = await AsyncStorage.getItem(appJson.key.loginToken);

    //唯一标识
    const uid = 'uid';//DeviceInfo.getUniqueID();
    const headerParams = Object.assign({},token?{token:token}:{uid:uid});
    console.log((desc?desc:'')+'headerParams信息：'+JSON.stringify(headerParams));

    //签名
    const sign = md5(appJson.key.sign);
    console.log((desc?desc:'')+'sign信息：'+JSON.stringify(sign));

    //body参数
    const params = Object.assign({},object);
    console.log((desc?desc:'')+'params信息：'+JSON.stringify(params));

    return new Promise(async (resolve,reject)=>{
        try{
            const data = await fetchUtil.init()
                .setUrl(appJson.action.url+actionType)
                .setMethod('POST')
                .setHeader(Object.assign({},headerParams,{sign:appJson.key.sign}))
                .setBodyType(bodyType?bodyType:'json')
                .setBody(params)
                .dofetch();

            console.log((desc?desc:'')+'返回数据：'+JSON.stringify(Object.assign({},result,data)));
            if(result.type !== appJson.action.signOut && data.code === appJson.action.sessionError){
                console.log(11);
                reject(Object.assign({},result,data));
            }else{
                console.log(22);
                resolve(Object.assign({},result,data));
            }
        }catch (e) {
            console.log((desc?desc:'')+'返回异常：'+JSON.stringify(e));
            let msg = e;
            if("server error TypeError: Network request failed" === e){
                msg = '很报歉，服务器正在维修中，请稍后再使用';
            }else if('request timeout' === e){
                msg = '请求超时，请刷新重试';
            }
            reject(Object.assign({code:appJson.action.connectServerError,msg:msg},result));
        }
    })

}
