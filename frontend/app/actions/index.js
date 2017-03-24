import axios from 'axios';

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
  return {
    type: 'SESSION_LOGIN_SUCESS',
    session: response,
  };
}

export default function login(email, password) {
  return (dispatch) => {
    dispatch(performLogin(email, password));
    return axios.post('/login', { email, password })
      .then((response) => {
        return dispatch(loginSuccess(response));
      })
      .catch((error) => {
        return dispatch(loginFail(error));
      });
  };
}