import get from 'lodash/get';
import isArray from 'lodash/isArray';
import find from 'lodash/find';

export function getError(reason, code) {
  const errors = get(reason, 'response.data.errors');
  if (!isArray(errors)) {
    return;
  }
  return find(errors, error => error.code === code);
}
