import _ from 'lodash';

export function ellipsis(text, size = 30, ellipsisSuffix = '...') {
  if (text.length > size) {
    let subtext = text.substring(0, size - 3);
    subtext = _.trimEnd(subtext);
    return `${subtext}${ellipsisSuffix}`;
  }
  return text;
}

export function toUppercasesWords(words) {
  return _(words)
    .words()
    .map(w => _.upperFirst(w))
    .join(' ');
}

export function dateToText(val, showSeconds = false) {
  let date;
  if (_.isDate(val)) {
    date = val;
  } else if (_.isNumber(val)) {
    date = new Date(val);
  }

  if (!date || _.isNaN(date.getTime())) {
    return;
  }

  const year = date.getFullYear();
  let month = addZero((1 + date.getMonth()).toString());
  let day = addZero(date.getDate().toString());

  let seconds = '';
  if (showSeconds) {
    const hours = addZero(date.getHours().toString());
    const mins = addZero(date.getMinutes().toString());
    const secs = addZero(date.getSeconds().toString());
    seconds += ` ${hours}:${mins}:${secs}`;
  }

  return `${day}/${month}/${year}${seconds}`;
}

export function createLink(name, id) {
  const dashTitle = _(name)
    .split(/\W+/)
    .compact()
    .join('-')
    .toLowerCase();
  const url = encodeURI(dashTitle);
  return `/article/${url}-${id}`;
}

export function getIdFromLink(link) {
  const dashTitle = decodeURI(link);
  const lastDash = dashTitle.lastIndexOf('-');
  return lastDash === -1 ? '' : dashTitle.substring(lastDash + 1);
}


function addZero(val) {
  return val.length > 1 ? val : `0${val}`;;
}
