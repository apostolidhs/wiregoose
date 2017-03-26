import _ from 'lodash';
import { combineReducers } from 'redux';

const session = (
  state = {
    user: undefined,
    isRequesting: false,
  },
  action,
) => {
  switch (action.type) {
    case 'SESSION_LOGIN_PERFORM':
      return _.assignIn({}, state, {
        isRequesting: true,
      });
    case 'SESSION_LOGIN_SUCESS':
      return _.assignIn({}, state, {
        isRequesting: false,
        user: action.session,
      });
    case 'SESSION_LOGIN_FAIL':
      return _.assignIn({}, state, {
        isRequesting: false,
      });
    default:
      return state;
  }
};

const wiregooseApp = {
  session,
};

export default wiregooseApp;
