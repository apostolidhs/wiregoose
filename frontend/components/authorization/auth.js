import noop from 'lodash/noop';
import now from 'lodash/now';
import jwtDecode from 'jwt-decode';

import {publish} from '../events/events.jsx';
import {syncBookmarks} from '../bookmarks/bookmarks.js';
import {launch} from './auth-modal.jsx';
import { SUPPORTED_LANGUAGES, JWT_EXPIRATION_PERIOD} from '../../../config-public.js';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';

export function loginViaFacebook(accessToken) {
  return WiregooseApi.facebookAuthorize(accessToken)
    .then(resp => onLoginSuccess(resp))
    .then(() => publish('credentials', {type: 'LOGIN'}));
}

export function login(email, password) {
  return WiregooseApi.login(email, password)
    .then(resp => onLoginSuccess(resp))
    .then(() => publish('credentials', {type: 'LOGIN'}));
}

export function signup(email, password) {
  return WiregooseApi.signup(email, password)
  .then(resp => login(email, password))
  .then(() => publish('credentials', {type: 'SIGNUP'}));
}

export function logout() {
  const fromFacebook = hasFacebookAccount();
  this.destroySession();
  WiregooseApi.setCredentialGetter(noop);
  publish('credentials', {type: 'LOGOUT'});
  if (fromFacebook && window.FB) {
    FB.logout();
  }
}

export function launchAuthModal({type, prompt}) {
  return launch({type, prompt});
}

export function isAuthenticated() {
  const { token, session } = getSession();
  return !!token && (session.expiresAt > now());
}

export function isAdmin() {
  const { user } = getSession();
  return !!(user && user.role === 'ADMIN');
}

export function isUser() {
  const { user } = getSession();
  return !!(user && user.role === 'USER');
}

export function isEmailValid() {
  const { user } = getSession();
  return !!(user && user.isEmailValid);
}

export function hasFacebookAccount() {
  const { user } = getSession();
  return !!(user && user.hasFacebookAccount);
}

export function validateUserEmail() {
  if (isAuthenticated()) {
    const { user } = getSession();
    user.isEmailValid = true;
    storeUser(user);
  }
}

function onLoginSuccess(resp) {
  const jwt = resp.data.data;
  if (!jwt) {
    throw new Error('Invalid API response, jwt is missing');
  }
  WiregooseApi.setCredentialGetter(() => jwt);
  const { session, user } = jwtDecode(jwt);
  createSession(jwt, user, session, SUPPORTED_LANGUAGES[0]);

  return syncBookmarks();
}

function storeUser(user) {
  window.localStorage.setItem('user', JSON.stringify(user));
}

export function createSession(token, user, session, lang) {
  window.localStorage.setItem('token', token);
  storeUser(user);
  window.localStorage.setItem('session', JSON.stringify(session));
}

export function destroySession() {
  window.localStorage.setItem('token', '');
  window.localStorage.setItem('user', '');
  window.localStorage.setItem('session', '');
}

export function getSession() {
  const lang = getSessionLang();
  const token = window.localStorage.getItem('token') || '';
  const userStr = window.localStorage.getItem('user');
  const sessionStr = window.localStorage.getItem('session');

  let session = '';
  let user = '';
  try { user = JSON.parse(userStr); } catch(e) {}
  try { session = JSON.parse(sessionStr); } catch(e) {}

  return { token, user, session, lang };
}

export function getSessionLang() {
  return window.localStorage.getItem('lang');
}

export function setSessionLang(lang) {
  window.localStorage.setItem('lang', lang);
}
