// @flow
import type { ReduxAction } from '../actions/types.js.flow';
import * as config from "../config";

type Action = {
  ...$Exact<ReduxAction>,
  token?: string,
  userInfo: {},
};

export type State = {
  token: ?string
};

const initialState = {
  token: null,
};

function userReducer(state: State = initialState, action: Action): State {
  if (action.type === config.SIGN_IN) {
    const { token, userInfo } = action.data?action.data:initialState;
    return {
      token,
      ...userInfo,
    };
  }

  if (action.type === config.SIGN_OUT) {
    return initialState;
  }

  return state;
}

export default userReducer;
