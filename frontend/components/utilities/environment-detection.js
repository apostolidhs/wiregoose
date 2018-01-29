import { API_URL, API_URL_PREFIX } from '../../../config-public.js';

export function isHttps() {
  return window.location.protocol == 'https:';
}

export function getApiUrl() {
  let API_ORIGIN = `${API_URL}/${API_URL_PREFIX}/`;
  return isHttps() ? API_ORIGIN.replace('http', 'https') : API_ORIGIN;
}

export function isAdmin() {
  return location.pathname.startsWith('/admin');
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
