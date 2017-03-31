import axios from 'axios';
import _ from 'lodash';

const apiUrl = 'http://localhost:3000/api/v1/';
let credentialGetter = _.noop;

export const crud = {
  retrieveAll,
  update,
};

export function setCredentialGetter(_credentialGetter) {
  credentialGetter = _credentialGetter;
}

export function login(email, password) {
  return axios({
    method: 'post',
    url: `${apiUrl}authorize/login`,
    data: { name: email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function retrieveAll(model, params) {
  return axios({
    method: 'get',
    url: `${apiUrl}${model.name}`,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function update(model, id, params) {
  const payload = {
    [_.upperFirst(model.name)]: params,
  };
  return axios({
    method: 'put',
    url: `${apiUrl}${model.name}/${id}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}
