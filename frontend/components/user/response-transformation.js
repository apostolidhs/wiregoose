import _ from 'lodash';

export default function translate(user) {
  user.created = new Date(user.created);
  user.lastLogin = new Date(user.lastLogin);
  return user;
}
