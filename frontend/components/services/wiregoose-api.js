import _ from 'lodash';
import axios from 'axios';
import promiseFinally from 'promise.prototype.finally';
promiseFinally.shim();

import { API_URL } from '../../config.js';
import ArticleResponseTransformation from '../article/response-transformation.js';
import ArticleBoxResponseTransformation from '../article-box/response-transformation.js';
import ServerErrorInterceptor from './server-error-interceptor.js';

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
    ServerErrorInterceptor(error, !!error.config.friendlyErrorInterceptor);
    // Do something with response error
    return Promise.reject(error);
  });

let credentialGetter = _.noop;

export const crud = {
  create,
  retrieve,
  retrieveAll,
  update,
  updateSingle,
  remove
};

export const rssFeed = {
  fetchRssFeed,
  fetchRssRegistrations
}

export const timeline = {
  explore: timelineExplore,
  category: timelineCategory,
  provider: timelineProvider,
  registration: timelineRegistration
}

export const statics = {
  categories: _.throttle(getStaticCategories, 3000),
  supportedLanguages: _.throttle(getStaticSupportedLanguage, 3000)
};

export function setCredentialGetter(_credentialGetter) {
  credentialGetter = _credentialGetter;
}

export function login(email, password) {
  return httpRequest({
    method: 'post',
    url: `${API_URL}authorize/login`,
    data: { name: email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getSucceededFetchesPerPeriod(days, lang) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}measures/succeededFetchesPerPeriod`,
    params: { days, lang },
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  })
}

export function getArticleStatistics() {
  return httpRequest({
    method: 'get',
    url: `${API_URL}measures/articles`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  })
}

export function getStatic(name, friendlyErrorInterceptor = false) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}statics/${name}`,
    friendlyErrorInterceptor
  });
}

export function fetchArticle(entryId, friendlyErrorInterceptor = false) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}article/mining/cachedFetch/entry/${entryId}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    friendlyErrorInterceptor
  })
  .then(resp => {
    resp.data.data = resp.data.data && ArticleResponseTransformation(resp.data.data);
    return resp;
  });
}

function timelineExplore(categories, lang, friendlyErrorInterceptor = false) {
  return getTimeline('explore', categories, lang, friendlyErrorInterceptor);
}

function timelineCategory(category, lang, friendlyErrorInterceptor = false) {
  return getTimeline('category', category, lang, friendlyErrorInterceptor);
}

function timelineProvider(provider, lang, friendlyErrorInterceptor = false) {
  return getTimeline('provider', provider, lang, friendlyErrorInterceptor);
}

function timelineRegistration(registration, lang, friendlyErrorInterceptor = false) {
  return getTimeline('registration', registration, lang, friendlyErrorInterceptor);
}

function getTimeline(endpoint, params, lang, friendlyErrorInterceptor) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}timeline/${endpoint}`,
    params: {
      ...params,
      lang
    },
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    friendlyErrorInterceptor
  })
  .then(resp => {
    resp.data.data = _.mapValues(
      resp.data.data,
      records => _.map(records, ArticleBoxResponseTransformation)
    );
    return resp;
  });
}

function getStaticSupportedLanguage() {
  return getStatic('supportedLanguages')
    .then(resp => {
      statics.language = () => Promise.resolve(resp);
      return resp;
    });
}

function getStaticCategories() {
  return getStatic('categories')
    .then(resp => {
      statics.categories = () => Promise.resolve(resp);
      return resp;
    });
}

function fetchRssFeed(link) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}rssFeed/fetch`,
    params: { q: link },
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  })
  .then(resp => {
    const data = resp.data.data;
    data.entries = _.map(data.entries, ArticleBoxResponseTransformation);
    return resp;
  });
}

function fetchRssRegistrations() {
  return httpRequest({
    method: 'post',
    url: `${API_URL}rssFeed/fetchRegistrations`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function create(modelName, params) {
  const payload = {
    [_.upperFirst(modelName)]: params,
  };
  return httpRequest({
    method: 'post',
    url: `${API_URL}${modelName}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function retrieve(modelName, params) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}${modelName}`,
    params,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function retrieveAll(modelName, params) {
  return httpRequest({
    method: 'get',
    url: `${API_URL}${modelName}`,
    params,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function update(modelName, id, params) {
  const payload = {
    [_.upperFirst(modelName)]: params,
  };
  return httpRequest({
    method: 'put',
    url: `${API_URL}${modelName}/${id}`,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function updateSingle(modelName, params) {
  const payload = {
    [_.upperFirst(modelName)]: params,
  };
  return httpRequest({
    method: 'put',
    url: `${API_URL}${modelName}`,
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
    url: `${API_URL}${modelName}/${id}`,
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
        _.delay(() => resolve(v), 0 && 2000);
      });
    });
}
