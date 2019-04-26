import {AsyncStorage,} from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import {md5} from '../common/ScreenUtil';
import * as config from '../config';
import FetchUtil from '../common/FetchUtil';
import {SERVER_ADDRES} from "../config";




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
  let token = await AsyncStorage.getItem(config.LOGIN_TOKEN_KEY);

  //唯一标识
  const uid = 'uid';//DeviceInfo.getUniqueID();
  const headerParams = Object.assign({},token?{token:token}:{uid:uid});
  console.log((desc?desc:'')+'headerParams信息：'+JSON.stringify(headerParams));

  //签名
  const sign = md5(config.SIGN);
  console.log((desc?desc:'')+'sign信息：'+JSON.stringify(sign));

  //body参数
  const params = Object.assign({},object);
  console.log((desc?desc:'')+'params信息：'+JSON.stringify(params));

  try{
    const data = await fetchUtil.init()
      .setUrl(SERVER_ADDRES+actionType)
      .setMethod('POST')
      .setHeader(Object.assign({},headerParams,{sign:sign}))
      .setBodyType(bodyType?bodyType:'json')
      .setBody(params)
      .dofetch();

    console.log((desc?desc:'')+'返回信息：'+JSON.stringify(data));
    result = Object.assign({},result,data);
  }catch (e) {
    console.log((desc?desc:'')+'返回异常：'+JSON.stringify(e));
    result = Object.assign(result,{msg:JSON.stringify(e)});
  }
  console.log((desc?desc:'')+'返回结果：'+JSON.stringify(result));
  return result;
}
