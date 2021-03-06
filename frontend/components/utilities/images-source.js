import startsWith from 'lodash/startsWith';
import { getApiUrl, isHttps } from './environment-detection';

const API_ORIGIN = getApiUrl();
const httpsMode = isHttps();

export function toArticleBox(src) {
  return `${API_ORIGIN}proxy/image?q=${encodeURIComponent(src)}&w=270&h=150`;
}

export default function(src) {
  if (httpsMode && startsWith(src, 'http:')) {
    return `${API_ORIGIN}proxy/image?q=${encodeURIComponent(src)}`;
  }

  return src;
}
