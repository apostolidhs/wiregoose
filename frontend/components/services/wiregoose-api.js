import axios from 'axios';
import _ from 'lodash';

import * as config from '../../config.js';

let credentialGetter = _.noop;

export const crud = {
  create,
  retrieveAll,
  update,
  remove
};

export function setCredentialGetter(_credentialGetter) {
  credentialGetter = _credentialGetter;
}

export function login(email, password) {
  return axios({
    method: 'post',
    url: `${config.apiUrl}authorize/login`,
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
    url: `${config.apiUrl}${modelName}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function retrieveAll(modelName, params) {
  return axios({
    method: 'get',
    url: `${config.apiUrl}${modelName}`,
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
    url: `${config.apiUrl}${modelName}/${id}`,
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
    url: `${config.apiUrl}${modelName}/${id}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}
