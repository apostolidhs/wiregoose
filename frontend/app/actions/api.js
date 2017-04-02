import axios from 'axios';
import _ from 'lodash';

const apiUrl = 'http://localhost:3000/api/v1/';
let credentialGetter = _.noop;

export const crud = {
  create,
  retrieveAll,
  update,
  remove,
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

function create(modelName, params) {
  const payload = {
    [_.upperFirst(modelName)]: params,
  };
  return axios({
    method: 'post',
    url: `${apiUrl}${modelName}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function retrieveAll(modelName, params) {
  return axios({
    method: 'get',
    url: `${apiUrl}${modelName}`,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function update(modelName, id, params) {
  const payload = {
    [_.upperFirst(modelName)]: params,
  };
  return axios({
    method: 'put',
    url: `${apiUrl}${modelName}/${id}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function remove(modelName, id) {
  return axios({
    method: 'delete',
    url: `${apiUrl}${modelName}/${id}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
