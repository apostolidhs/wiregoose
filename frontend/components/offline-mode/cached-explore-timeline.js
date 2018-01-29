import _ from 'lodash';
import {getItem, setItem} from '../services/cache.js';

const KEY = 'exploreTimeline';

export function createResponseHandler() {
  const cache = [];
  return resp => {
    if (cache.length > 2) {
      return Promise.resolve(resp);
    }
    cache.push(resp.data);
    return setItem(KEY, cache)
      .then(() => resp);
  };
}

export function composeCachedResponse() {
  return getItem(KEY).then(cache => {
    if (_.isEmpty(cache)) {
      return;
    }

    const composedData = _.transform(cache, (result, data) => {
      _.each(data.data, (records, catName) => {
        result[catName] = (result[catName] || []).concat(records);
      });
    }, {});

    return {data: {data: composedData}};
  });
}
