import axios from 'axios';
import _ from 'lodash';

import * as config from '../../config.js';

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

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
  return httpRequest({
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
  return httpRequest({
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
  return httpRequest({
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
  return httpRequest({
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
  return httpRequest({
    method: 'delete',
    url: `${config.apiUrl}${modelName}/${id}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function httpRequest(opts) {
  return axios(opts)
    .then((v) => {
      return new Promise((resolve) => {
        _.delay(() => resolve(v), 0);
      });
    });
}
