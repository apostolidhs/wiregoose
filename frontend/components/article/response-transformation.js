import _ from 'lodash';

import ArticleBoxResponseTransformation from '../article-box/response-transformation.js';
import ImagesSources from '../utilities/images-source.js';
import {isHttps} from '../utilities/environment-detection.js';

export default function translate(entry) {
  if (entry.createdAt) {
    entry.createdAt = new Date(entry.createdAt);
  }
  if (_.isObject(entry.entryId)) {
    entry.entryId = ArticleBoxResponseTransformation(entry.entryId);
  }
  if (entry.link) {
    entry.link = decodeURIComponent(entry.link);
  }
  if (entry.content) {
    var el = document.createElement('div');
    el.innerHTML = entry.content;
    entry.contentEl = el;
    proxyImageLinks(el);
  }
  return entry;
}


function proxyImageLinks(content) {
  const imgs = content.getElementsByTagName('img');
  for(let i = 0; i < imgs.length; ++i) {
    const img = imgs[i];
    if (img && img.hasAttribute('src')) {
      const src = img.getAttribute('src');
      const proxiedSrc = ImagesSources(src);
      img.setAttribute('src', proxiedSrc);
    }
  }
}
