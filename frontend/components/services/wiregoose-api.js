import _ from 'lodash';
import axios from 'axios';
import promiseFinally from 'promise.prototype.finally';
promiseFinally.shim();

import { getApiUrl } from '../utilities/environment-detection';
import ArticleResponseTransformation from '../article/response-transformation.js';
import ArticleBoxResponseTransformation from '../article-box/response-transformation.js';
import ServerErrorInterceptor from './server-error-interceptor.js';

const API_ORIGIN = getApiUrl();

// add this to set timeout
//  .then(resp => new Promise(r => setTimeout(() => r(resp), 4000000000000)));
// (new Promise(r => setTimeout(() => r(), 4000000000000))).then(() =>

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
    const promise = ServerErrorInterceptor(error, error.config.friendlyErrorInterceptor);
    // Do something with response error
    return promise || Promise.reject(error);
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
  fetchRssRegistrations,
  registrationFetches
}

export const timeline = {
  explore: timelineExplore,
  category: timelineCategory,
  provider: timelineProvider,
  registration: timelineRegistration,
  bookmarks: timelineBookmarks
}

export const bookmarks = {
  retrieveAllIds: bookmarksRetrieveAllIds,
  pushId: bookmarksPushId,
  removeId: bookmarksRemoveId
};

export const statics = {
  categories: _.throttle(getStaticCategories, 3000),
  supportedLanguages: _.throttle(getStaticSupportedLanguage, 3000)
};

export function setCredentialGetter(_credentialGetter) {
  credentialGetter = _credentialGetter;
}

export function facebookAuthorize(accessToken) {
  return httpRequest({
    method: 'post',
    url: `${API_ORIGIN}authorize/facebook`,
    data: { access_token: accessToken },
    friendlyErrorInterceptor: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function login(email, password) {
  return httpRequest({
    method: 'post',
    url: `${API_ORIGIN}authorize/login`,
    data: { email, password },
    friendlyErrorInterceptor: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function signup(email, password, lang) {
  return httpRequest({
    method: 'post',
    url: `${API_ORIGIN}authorize/signup`,
    data: { email, password, lang },
    friendlyErrorInterceptor: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function resetPassword(email) {
  return httpRequest({
    method: 'post',
    url: `${API_ORIGIN}authorize/resetPassword`,
    data: { email },
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getSucceededFetchesPerPeriod(days, lang) {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}measures/succeededFetchesPerPeriod`,
    params: { days, lang },
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  });
}

export function getArticleStatistics() {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}measures/articles`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  });
}

export function getUserStatistics() {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}measures/users`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  });
}

export function getProxyCacheInfo() {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}proxy/cacheInfo`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  })
  .then(resp => {
    const {files} = resp.data.data;
    _.each(files, f => f.created = new Date(f.created));
    return resp;
  });
}

export function getRssRegistrationsFetches() {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}measures/registrationFetches`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentialGetter(),
    },
  });
}

export function getStatic(name, friendlyErrorInterceptor = false) {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}statics/${name}`,
    friendlyErrorInterceptor
  });
}

export function fetchArticle(entryId, relatedArticles = false, friendlyErrorInterceptor = false) {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}article/mining/cachedFetch/entry/${entryId}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    params: {
      relatedArticles
    },
    friendlyErrorInterceptor
  })
  .then(resp => {
    const {article, relatedEntries} = resp.data.data;
    resp.data.data.article = ArticleResponseTransformation(article);
    resp.data.data.relatedEntries = _.map(
      relatedEntries, ArticleBoxResponseTransformation
    );
    return resp;
  })
}

export function entryRelated(entryId) {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}entry/${entryId}/related`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    friendlyErrorInterceptor: true
  })
  .then(resp => {
    resp.data.data = _.map(
      resp.data.data, ArticleBoxResponseTransformation
    );
    return resp;
  });
}

function bookmarksRetrieveAllIds(userId, {populate = false, friendlyErrorInterceptor = true} = {}) {
  const q = populate ? '?populate=true' : '';
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}user/${userId}/bookmarks${q}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    friendlyErrorInterceptor
  });
}

function bookmarksPushId(userId, entryId) {
  return httpRequest({
    method: 'post',
    url: `${API_ORIGIN}user/${userId}/bookmarks/${entryId}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    friendlyErrorInterceptor: true
  });
}

function bookmarksRemoveId(userId, entryId) {
  return httpRequest({
    method: 'delete',
    url: `${API_ORIGIN}user/${userId}/bookmarks/${entryId}`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
    friendlyErrorInterceptor: true
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

function timelineBookmarks(userId, friendlyErrorInterceptor) {
  return bookmarksRetrieveAllIds(userId, {populate: true, friendlyErrorInterceptor})
    .then(resp => {
      resp.data.data.bookmarks = _.map(resp.data.data.bookmarks, ArticleBoxResponseTransformation);
      return resp;
    });
}

function getTimeline(endpoint, params, lang, friendlyErrorInterceptor) {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}timeline/${endpoint}`,
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
    url: `${API_ORIGIN}rssFeed/fetch`,
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
    url: `${API_ORIGIN}rssFeed/fetchRegistrations`,
    headers: {
      'Content-Type': 'application/json',
      authorization: credentialGetter(),
    },
  });
}

function registrationFetches(lang) {
  return httpRequest({
    method: 'get',
    url: `${API_ORIGIN}rssFeed/registrationFetches`,
    params: {lang},
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
    url: `${API_ORIGIN}${modelName}`,
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
    url: `${API_ORIGIN}${modelName}`,
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
    url: `${API_ORIGIN}${modelName}`,
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
    url: `${API_ORIGIN}${modelName}/${id}`,
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
    url: `${API_ORIGIN}${modelName}`,
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
    url: `${API_ORIGIN}${modelName}/${id}`,
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
