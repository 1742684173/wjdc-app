import * as appJson from '../../app.json';


export const setGestureAction  = async (object:Object) =>{
    let result = Object.assign({type:appJson.action.setGesture},object) ;
    console.log('设置手势：'+JSON.stringify(result))
    return new Promise(async (resolve,reject)=>{
        resolve(result);
    });
}
