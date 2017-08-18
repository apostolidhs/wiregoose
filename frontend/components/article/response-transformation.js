import _ from 'lodash';

import ArticleBoxResponseTransformation from '../article-box/response-transformation.js';

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
  return entry;
}
