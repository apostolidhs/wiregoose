import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import find from 'lodash/find';
import remove from 'lodash/remove';
import {subscribe, publish} from '../events/events.js';
import {
  interests as interestsAPI
} from '../../components/services/wiregoose-api.js';
import {getSession} from '../authorization/auth.js';
import {MAX_INTERESTS_PER_USER} from '../../../config-public.js';

let interests = [];

export function syncInterests() {
  return retrieveAllIds();
}

export function getinterestsLength() {
  return interests.length;
}

export function isMaximumInterestsReached() {
  return getinterestsLength() >= MAX_INTERESTS_PER_USER;
}

export function getInterest({value, type, lang}) {
  return find(
    interests,
    i => i.value === value && i.type === type && i.lang === lang
  );
}

function removeInteralInterest({value, type, lang}) {
  return remove(
    interests,
    i => i.value === value && i.type === type && i.lang === lang
  );
}

subscribe('credentials', evt => {
  const {type} = evt;
  if (type === 'LOGOUT') {
    interests = [];
    publish('interests', {type: 'DESTROYED'})
  }
});

function retrieveInterests() {
  const userId = getSession().user._id;
  return interestsAPI.retrieveAll(userId)
    .then(resp => interests = resp.data.data.interests)
    .then(() => notifyIfMaximumInterestsReached())
    .then(() => publish('interests', {type: 'RETRIEVED'}));
}

function pushInterest(interest) {
  if (getInterest(interest)) {
    return;
  }

  interests.push(interest);
  const userId = getSession().user._id;
  return interestsAPI.pushInterest({...interest, userId})
    .then(() => notifyIfMaximumInterestsReached())
    .catch(() => removeInteralInterest(interest));
}

function removeInterest(interest) {
  const interestWithId = getInterest(interest);
  if (!interestWithId) {
    return;
  }
  removeInteralInterest(interest);
  const userId = getSession().user._id;
  return interestsAPI.removeInterest(userId, interestWithId._id)
    .then(() => notifyIfMaximumInterestsUnreached())
    .catch(() => interests.push(interest));
}

function notifyIfMaximumInterestsReached() {
  if (isMaximumInterestsReached()) {
    publish('interests', {type: 'MAXIMUM_REACHED'});
  }
}

function notifyIfMaximumInterestsUnreached() {
  if (getinterestsLength() === MAX_INTERESTS_PER_USER - 1) {
    publish('interests', {type: 'MAXIMUM_UNREACHED'});
  }
}
