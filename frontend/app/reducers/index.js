import _ from 'lodash';
import CrudReducer from '../components/crud-generator/reducers.js';

const session = (
  state = {
    user: undefined,
    auth: undefined,
    isRequesting: false,
  },
  action,
) => {
  switch (action.type) {
    case 'SESSION_LOGIN_PERFORM':
      return _.assignIn({}, state, {
        isRequesting: true,
      });
    case 'SESSION_LOGIN_SUCCESS':
      return _.assignIn({}, state, {
        isRequesting: false,
        user: action.user,
        auth: action.session,
      });
    case 'SESSION_LOGIN_FAIL':
      return _.assignIn({}, state, {
        isRequesting: false,
      });
    case 'SESSION_LOGOUT':
      return _.assignIn({}, state, {
        isRequesting: false,
        user: undefined,
        auth: undefined,
      });
    default:
      return state;
  }
};

const wiregooseApp = {
  session,
  crud: CrudReducer,
};

export default wiregooseApp;
