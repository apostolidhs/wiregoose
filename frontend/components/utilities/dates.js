import now from 'lodash/now';
import isDate from 'lodash/isDate';
import isNumber from 'lodash/isNumber';
import isNaN from 'lodash/isNaN';

import tr from '../localization/localization.js';

export const TIME_1_MIN = 60 * 1000;
export const TIME_10_MIN = 10 * TIME_1_MIN;
export const TIME_1_HOUR = 60 * TIME_1_MIN;
export const TIME_1_DAY = 24 * TIME_1_HOUR;
export const TIME_2_DAYS = 2 * TIME_1_DAY;

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

  const current = now();
  const timestamp = date.getTime();
  const diff = current - timestamp;

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
      prefixWithZeroIF2Digits(date.getHours().toString()),
      ':',
      prefixWithZeroIF2Digits(date.getMinutes().toString())
    ].join('');
  } else {
    return toText(timestamp);
  }
}

function getDate(val) {
  let date;
  if (isDate(val)) {
    date = val;
  } else if (isNumber(val)) {
    date = new Date(val);
  }

  if (!date || isNaN(date.getTime())) {
    return;
  }

  return date;
}

function prefixWithZeroIF2Digits(val) {
  return val.length > 1 ? val : `0${val}`;;
}
