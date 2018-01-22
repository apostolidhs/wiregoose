import _ from 'lodash';

import {subscribe, publish} from '../events/events.jsx';
import {
  bookmarks as bookmarksAPI
} from '../../components/services/wiregoose-api.js';
import {getSession} from '../authorization/auth.js';
import {MAX_BOOKMARKS_PER_USER} from '../../../config-public.js';

let bookmarkIds = {};

export function syncBookmarks() {
  return retrieveAllIds();
}

export function hasBookmark(entryId) {
  return entryId in bookmarkIds;
}

export function setBookmark(entryId, toggle = false) {
  if (toggle) {
    return pushId(entryId);
  } else {
    return removeId(entryId);
  }
}

export function getBookmarksLength() {
  return _.size(bookmarkIds);
}

export function isMaximumBookmarksReached() {
  return getBookmarksLength() >= MAX_BOOKMARKS_PER_USER;
}

subscribe('credentials', evt => {
  const {type} = evt;
  if (type === 'LOGOUT') {
    bookmarkIds = {};
    publish('bookmarks', {type: 'DESTROYED'})
  }
});

function retrieveAllIds() {
  const userId = getSession().user._id;
  return bookmarksAPI.retrieveAllIds(userId)
    .then(resp => bookmarkIds = _.keyBy(resp.data.data.bookmarks))
    .then(() => notifyIfMaximumBookmarksReached())
    .then(() => publish('bookmarks', {type: 'RETRIEVED'}));
}

function pushId(entryId) {
  if (hasBookmark(entryId)) {
    return;
  }
  bookmarkIds[entryId] = entryId;
  const userId = getSession().user._id;
  return bookmarksAPI.pushId(userId, entryId)
    .then(() => notifyIfMaximumBookmarksReached())
    .catch(() => delete bookmarkIds[entryId]);
}

function removeId(entryId) {
  if (!hasBookmark(entryId)) {
    return;
  }
  delete bookmarkIds[entryId];
  const userId = getSession().user._id;
  return bookmarksAPI.removeId(userId, entryId)
    .then(() => notifyIfMaximumBookmarksUnreached())
    .catch(() => bookmarkIds[entryId] = entryId);
}

function notifyIfMaximumBookmarksReached() {
  if (isMaximumBookmarksReached()) {
    publish('bookmarks', {type: 'MAXIMUM_REACHED'});
  }
}

function notifyIfMaximumBookmarksUnreached() {
  if (getBookmarksLength() === MAX_BOOKMARKS_PER_USER - 1) {
    publish('bookmarks', {type: 'MAXIMUM_UNREACHED'});
  }
}
