import _ from 'lodash';

export function getError(reason, code) {
  const errors = _.get(reason, 'response.data.errors');
  if (!_.isArray(errors)) {
    return;
  }
  return _.find(errors, error => error.code === code);
}
