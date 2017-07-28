import axios from 'axios';
import _ from 'lodash';

import * as config from '../../config.js';
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
    if (!error.config.preventErrorInterceptor) {
      ServerErrorInterceptor(error);
    }
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
  category: timelineCategory
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
    url: `${config.apiUrl}authorize/login`,
    data: { name: email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getSucceededFetchesPerPeriod(days, lang) {
  return httpRequest({
    method: 'get',
    url: `${config.apiUrl}measures/succeededFetchesPerPeriod`,
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
    url: `${config.apiUrl}measures/articles`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  })
}

export function getStatic(name) {
  return httpRequest({
    method: 'get',
    url: `${config.apiUrl}statics/${name}`
  });
}

export function fetchArticle(entryId, preventErrorInterceptor = false) {
  return httpRequest({
    method: 'get',
    url: `${config.apiUrl}article/mining/cachedFetch/entry/${entryId}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    preventErrorInterceptor
  })
  .then(resp => {
    const article = ArticleResponseTransformation(resp.data.data);
    return resp;
  });
}

function timelineExplore(categories) {
  return getTimeline('explore', categories);
}

function timelineCategory(category) {
  return getTimeline('category', category);
}

function getTimeline(endpoint, params) {
  return httpRequest({
    method: 'get',
    url: `${config.apiUrl}timeline/${endpoint}`,
    params,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
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
    url: `${config.apiUrl}rssFeed/fetch`,
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
    url: `${config.apiUrl}rssFeed/fetchRegistrations`,
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
    url: `${config.apiUrl}${modelName}`,
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
    url: `${config.apiUrl}${modelName}`,
    params,
    headers: {
      'Content-Type': 'application/json',
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

function updateSingle(modelName, params) {
  const payload = {
    [_.upperFirst(modelName)]: params,
  };
  return httpRequest({
    method: 'put',
    url: `${config.apiUrl}${modelName}`,
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
        _.delay(() => resolve(v), 0 && 2000);
      });
    });
}
