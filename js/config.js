
//签名参数
export const SIGN = '1as2jfa3jkfda.jkakk';

//访问成功
export const CODE_SUCCESS = 200;
//访问错误 服务器不理解请求的语法。
export const CODE_ERROR = 400;
//请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。。
export const SESSION_CODE_ERROR = 401;
//服务器没有打开
export const SERVER_DISCONNECT = 1000;

/**
 * 网络请求接口和参数
 */
//服务器地址
// export const SERVER_ADDRES = 'http://192.123.12.11:8080/wjdc';
export const SERVER_ADDRES = 'http://localhost:8080/wjdc';
//登录
export const SIGN_IN = '/user/signIn.do';
//登出
export const SIGN_OUT = '/user/signOut.do';

//新增帐单
export const BILL_ADD = '/bill/add.do';
export const BILL_FIND = '/bill/find.do';
export const BILL_FIND_BY_ID = '/bill/findById.do';

//增加帐单方式
export const BILL_METHOD_ADD = '/billMethod/add.do';
export const BILL_METHOD_DELETE_BY_ID = '/billMethod/deleteById.do';
export const BILL_METHOD_UPDATE_BY_ID = '/billMethod/updateById.do';
export const BILL_METHOD_FIND = '/billMethod/find.do';

//增加帐单类别
export const BILL_SORT_ADD = '/billSort/add.do';
export const BILL_SORT_DELETE_BY_ID = '/billSort/deleteById.do';
export const BILL_SORT_UPDATE_BY_ID = '/billSort/updateById.do';
export const BILL_SORT_FIND = '/billSort/find.do';


//存储AsyncStorage
//登录帐户key
export const LOGIN_ACCOUNT_KEY = 'login_account';
//登录密码
export const LOGIN_PASSWORD_KEY = 'login_password';
//token
export const LOGIN_TOKEN_KEY = 'login_token';

