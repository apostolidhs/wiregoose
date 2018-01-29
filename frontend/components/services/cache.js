export const setItem = (key, data) =>
  new Promise(resolve =>
    resolve(localStorage.setItem(key, JSON.stringify(data))));

export const getItem = key =>
  new Promise(resolve => {
    const item = localStorage.getItem(key);
    resolve(item && JSON.parse(item));
  });

export const hasItem = key =>
  new Promise(resolve =>
    resolve(localStorage.getItem(key)));

export const removeItem = key =>
  new Promise(resolve =>
    resolve(localStorage.removeItem(key)));
