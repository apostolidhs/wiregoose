import jwtDecode from 'jwt-decode';
import api from './api';

function performLogin(email, password) {
  return {
    type: 'SESSION_LOGIN_PERFORM',
    email,
    password,
  };
}

function loginFail(error) {
  return {
    type: 'SESSION_LOGIN_FAIL',
    reason: error,
  };
}

function loginSuccess(response) {
  const loginInfo = jwtDecode(response.data.data);
  return {
    type: 'SESSION_LOGIN_SUCCESS',
    session: loginInfo.session,
    user: loginInfo.user,
  };
}

export default function login(email, password) {
  return (dispatch) => {
    dispatch(performLogin(email, password));
    return api(email, password)
      .then((response) => {
        return dispatch(loginSuccess(response));
      })
      .catch((error) => {
        return dispatch(loginFail(error));
      });
  };
}
