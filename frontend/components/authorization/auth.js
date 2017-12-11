import _ from 'lodash';
import jwtDecode from 'jwt-decode';

import {publish} from '../events/events.jsx';
import {launch} from './auth-modal.jsx';
import { SUPPORTED_LANGUAGES } from '../../../config-public.js';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';

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
  this.destroySession();
  WiregooseApi.setCredentialGetter(_.noop);
  publish('credentials', {type: 'LOGOUT'})
}

export function launchAuthModal() {
  launch('LOGIN');
}

export function isAuthenticated() {
  const { token } = getSession();
  return !!token;
}

export function isAdmin() {
  const { user } = getSession();
  return !!(user && user.role === 'ADMIN');
}

export function isUser() {
  const { user } = getSession();
  return !!(user && user.role === 'USER');
}

function onLoginSuccess(resp) {
  const jwt = resp.data.data;
  if (!jwt) {
    throw new Error('Invalid API response, jwt is missing');
  }
  WiregooseApi.setCredentialGetter(() => jwt);
  const { session, user } = jwtDecode(jwt);
  createSession(jwt, user, session, SUPPORTED_LANGUAGES[0]);
}

export function createSession(token, user, session, lang) {
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', JSON.stringify(user));
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
