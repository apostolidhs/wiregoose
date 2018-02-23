import now from 'lodash/now';
import isObject from 'lodash/isObject';

export const setItem = (key, item) =>
  new Promise(resolve => {
    localStorage.setItem(key, createDatum(item));
    resolve(item);
  });

export const getItem = (key, {maxAge = -1, fetchOnMiss, fetchOldOnError} = {}) =>
  new Promise((resolve, reject) => {
    const datum = localStorage.getItem(key);
    const cell = deSerialize(datum);
    if (isValidDatum(cell) && (maxAge === -1 || ((cell.created + maxAge) > now()))) {
      return resolve(cell.item);
    }

    if (!fetchOnMiss) {
      return resolve();
    }

    return fetchOnMiss()
      .then(resp => setItem(key, resp))
      .then(resolve)
      .catch(reason => isValidDatum(cell) && fetchOldOnError
        ? resolve(cell.item)
        : reject(reason)
      );
  });

// export const hasItem = key =>
//   new Promise(resolve =>
//     resolve(!!localStorage.getItem(key)));

export const removeItem = key =>
  new Promise(resolve =>
    resolve(localStorage.removeItem(key)));

function createDatum(item, created = now()) {
  return serialize({item, created});
}

function deSerialize(raw) {
  try {
    return JSON.parse(raw);
  } catch(e) {}
}

function serialize(cell) {
  return JSON.stringify(cell);
}

function isValidDatum(cell) {
  return isObject(cell) && cell.created && cell.item;
}
