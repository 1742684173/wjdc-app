import {fork,call, put, takeEvery} from 'redux-saga/effects';     // 引入相关函数
import {watchWebsocket} from "./webscoketSaga";

export default function* rootSaga() {
    yield fork(watchWebsocket);
}