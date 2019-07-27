// @flow
import type { ReduxAction } from '../actions/types.js.flow';
import * as appJson from '../../app.json'

type Action = {
    ...$Exact<ReduxAction>,
    token?: string,
    lockPassword?: string,
    userInfo?: Object,
};

export type State = {
    token: ?string,
    lockPassword: ?string,
    userInfo: ?Object,
};

const initialState = {
    token: null,
    lockPassword: null,
    userInfo: {},
};

function userReducer(state: State = initialState, action: Action): State {
    if (action.type === appJson.action.signIn) {
        const { token, userInfo } = action.data;
        return {
            token,
            ...userInfo,
        };
    }

    if (action.type === appJson.action.setGesture) {
        const { token, userInfo,lockPassword } = action;
        return {
            token,
            ...userInfo,
            lockPassword:lockPassword
        };
    }

    if (action.type === appJson.action.signOut) {
        console.log('退出reducer');
        return initialState;
    }

    return state;
}

export default userReducer;
