
//签名参数
export const SIGN = '1as2jfa3jkfda.jkakk';

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
export const ADD_BILL = '/bill/add.do';
//查询帐单
export const FIND_BILL = '/bill/find.do';

//增加帐单方式
export const ADD_BILL_METHOD = '/billMethod/add.do';
export const DELETE_BILL_METHOD_BY_ID = '/billMethod/deleteById.do';
export const UPDATE_BILL_METHOD = '/billMethod/update.do';
export const FIND_BILL_METHOD = '/billMethod/find.do';

//增加帐单类别
export const ADD_BILL_SORT = '/billSort/add.do';
export const DELETE_BILL_SORT_BY_ID = '/billSort/deleteById.do';
export const UPDATE_BILL_SORT = '/billSort/update.do';
export const FIND_BILL_SORT = '/billSort/find.do';




//查询分类
export const FIND_SORT = '/sort/findSort.do';
//新增分类
export const ADD_SORT = '/sort/addSort.do';
//编辑分类
export const EDIT_SORT = '/sort/editSort.do';

//存储AsyncStorage
//登录帐户key
export const LOGIN_ACCOUNT_KEY = 'login_account';
//登录密码
export const LOGIN_PASSWORD_KEY = 'login_password';
//token
export const LOGIN_TOKEN_KEY = 'login_token';

