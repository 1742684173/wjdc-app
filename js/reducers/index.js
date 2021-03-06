// @flow
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import userReducer from './userReducer';
import webscoketReducer from './websocketReducer';

export default combineReducers({
    user: userReducer,
    form,
    websocket:webscoketReducer,
});
