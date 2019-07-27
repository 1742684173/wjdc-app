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
    let token = await AsyncStorage.getItem(appJson.key.token);
    let codeToken = await AsyncStorage.getItem(appJson.key.codeToken);

    //唯一标识
    const uid = 'uid';//DeviceInfo.getUniqueID();
    const headerParams = Object.assign({uid:uid},token?{token:token}:{},codeToken?{codeToken:codeToken}:{});
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

            result = Object.assign({},result,data)
            console.log((desc?desc:'')+'返回数据：'+JSON.stringify(result));

            if(result.code === appJson.action.success){
                resolve(result);
            }else{
                reject(result.msg);
            }

        }catch (e) {
            //console.log((desc?desc:'')+'返回异常：'+JSON.stringify(e));
            let msg = e;
            if("server error TypeError: Network request failed" === e){
                msg = '很报歉，服务器正在维修中，请稍后再使用';
            }else if('request timeout' === e){
                msg = '请求超时，请刷新重试';
            }else{
                msg = '请求错误';
            }

            result = Object.assign(result,{msg:msg,code:appJson.action.connectServerError})
            console.log((desc?desc:'')+'返回数据异常：'+JSON.stringify(result));

            if(result.type === appJson.action.signOut){
                resolve(result);
            }else{
                reject(result);
            }

        }
    })

}
