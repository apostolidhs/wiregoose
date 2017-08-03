import _ from 'lodash';

import tr from '../localization/localization.js';

const TIME_1_MIN = 60 * 1000;
const TIME_10_MIN = 10 * TIME_1_MIN;
const TIME_1_HOUR = 60 * TIME_1_MIN;
const TIME_1_DAY = 24 * TIME_1_HOUR;
const TIME_2_DAYS = 2 * TIME_1_DAY;

export function toText(val, showSeconds = false) {
  const date = getDate(val);
  if (!date) {
    return;
  }

  const year = date.getFullYear();
  let month = prefixWithZeroIF2Digits((1 + date.getMonth()).toString());
  let day = prefixWithZeroIF2Digits(date.getDate().toString());

  let seconds = '';
  if (showSeconds) {
    const hours = prefixWithZeroIF2Digits(date.getHours().toString());
    const mins = prefixWithZeroIF2Digits(date.getMinutes().toString());
    const secs = prefixWithZeroIF2Digits(date.getSeconds().toString());
    seconds += ` ${hours}:${mins}:${secs}`;
  }

  return `${day}/${month}/${year}${seconds}`;
}

export function fromNow(val) {
  const date = getDate(val);
  if (!date) {
    return;
  }

  const now = _.now();
  const timestamp = date.getTime();
  const diff = now - timestamp;

  if (diff < 0) {
    return tr.timeNotYet;
  } else if (diff < TIME_10_MIN) {
    return tr.timeNow;
  } else if (diff < TIME_1_HOUR) {
    return Math.floor(diff / TIME_1_MIN) + ' ' + tr.timeMinsAgo;
  } else if (diff < TIME_1_DAY) {
    return Math.floor(diff / TIME_1_HOUR) + ' ' + tr.timeHoursAgo;
  } else if (diff < TIME_2_DAYS) {
    return [
      tr.timeYesterday,
      ', ',
      prefixWithZeroIF2Digits(nowDate.getHours().toString()),
      ':',
      prefixWithZeroIF2Digits(nowDate.getMinutes().toString())
    ].join('');
  } else {
    return toText(timestamp);
  }
}

function getDate(val) {
  let date;
  if (_.isDate(val)) {
    date = val;
  } else if (_.isNumber(val)) {
    date = new Date(val);
  }

  if (!date || _.isNaN(date.getTime())) {
    return;
  }

  return date;
}

function prefixWithZeroIF2Digits(val) {
  return val.length > 1 ? val : `0${val}`;;
}
