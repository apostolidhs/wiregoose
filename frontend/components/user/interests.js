import size from 'lodash/size';
import keyBy from 'lodash/keyBy';
import find from 'lodash/find';
import remove from 'lodash/remove';
import {subscribe, publish} from '../events/events.js';
import {
  interests as interestsAPI
} from '../../components/services/wiregoose-api.js';
import {getSession} from '../authorization/auth.js';
import {MAX_INTERESTS_PER_USER} from '../../../config-public.js';

let interests = {};

export function syncInterests() {
  return retrieveInterests();
}

export function getinterestsLength() {
  return size(interests);
}

export function isMaximumInterestsReached() {
  return getinterestsLength() >= MAX_INTERESTS_PER_USER;
}

export function getInterest(interest) {
  return interests[getKey(interest)]
}

export function getKey({type, value, lang}) {
  return `${type}-${value}-${lang}`;
}

function removeInteralInterest(interest) {
  delete interests[getKey(interest)];
}

function addInternalInterest(interest) {
  interests[getKey(interest)] = interest;
}

subscribe('credentials', evt => {
  const {type} = evt;
  if (type === 'LOGOUT') {
    interests = {};
    publish('interests', {type: 'DESTROYED'})
  }
});

function retrieveInterests() {
  const userId = getSession().user._id;
  return interestsAPI.retrieveAll(userId, {cache: true})
    .then(resp => interests = keyBy(resp.data.data.interests, getKey))
    .then(() => notifyIfMaximumInterestsReached())
    .then(() => publish('interests', {type: 'RETRIEVED'}));
}

export function pushInterest(interest) {
  if (getInterest(interest)) {
    return;
  }

  addInternalInterest(interest);
  const userId = getSession().user._id;
  return interestsAPI.pushInterest({...interest, userId})
    .then(resp => interest._id = resp.data.data._id)
    .then(() => notifyIfMaximumInterestsReached())
    .catch(() => removeInteralInterest(interest));
}

export function removeInterest(interest) {
  const interestWithId = getInterest(interest);
  if (!interestWithId) {
    return;
  }
  removeInteralInterest(interest);
  const userId = getSession().user._id;
  return interestsAPI.removeInterest(userId, interestWithId._id)
    .then(() => notifyIfMaximumInterestsUnreached())
    .catch(() => addInternalInterest(interest));
}

export function toggleInterest(interest, nextToggle) {
  const hasInterest = nextToggle === undefined ? getInterest(interest) : nextToggle;
  if (hasInterest) {
    return removeInterest(interest);
  } else {
    return pushInterest(interest);
  }
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
