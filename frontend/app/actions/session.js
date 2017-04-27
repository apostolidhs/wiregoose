import jwtDecode from 'jwt-decode';
import * as api from './api';

export function isLoggedin() {

}

export function hasExpired(auth) {
  return auth && auth.expiresAt < Date.now();
}

export function isAdmin(user) {
  return user && user.role === 'ADMIN';
}

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
  const jwt = response.data.data;
  const { session, user } = jwtDecode(jwt);
  session.jwt = jwt;
  return {
    type: 'SESSION_LOGIN_SUCCESS',
    session,
    user,
  };
}

export function logout() {
  return (dispatch) => {
    return dispatch({
      type: 'SESSION_LOGOUT',
    });
  };
}

export function login(email, password) {
  return (dispatch) => {
    dispatch(performLogin(email, password));
    return api.login(email, password)
      .then(response => dispatch(loginSuccess(response)))
      .catch(error => dispatch(loginFail(error)));
  };
}
