import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/trimEnd';

import flow from 'lodash/fp/flow';
import words from 'lodash/fp/words';
import map from 'lodash/fp/map';
import join from 'lodash/fp/join';

import split from 'lodash/fp/split';
import compact from 'lodash/fp/compact';
import toLower from 'lodash/fp/toLower';

import toPairs from 'lodash/fp/toPairs';

export function ellipsis(text, size = 30, ellipsisSuffix = '...') {
  if (text.length > size) {
    let subtext = text.substring(0, size - 3);
    subtext = trimEnd(subtext);
    return `${subtext}${ellipsisSuffix}`;
  }
  return text;
}

export function toUppercasesWords(strings) {
  return flow(
    words,
    map(w => upperFirst(w)),
    join(' ')
  )(strings);
}

export function createLink(name, id) {
  const dashTitle = flow(
    split(/[^\wΆΈ-ϗἀ-῾]+/gi),//.split(/\W+/)
    compact,
    join('-'),
    toLower,
  )(name);
  const url = encodeURI(dashTitle);
  return `/article/${url}-${id}`;
}

export function getIdFromLink(link, matchMongoId = false) {
  const dashTitle = decodeURI(link);
  const lastDash = dashTitle.lastIndexOf('-');
  if (lastDash === -1) {
    return;
  }
  const id = dashTitle.substring(lastDash + 1);
  if (matchMongoId) {
    return isMongoId(id) ? id : undefined;
  }
  return id;
}

export function isMongoId(id) {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
}

export function createAbsoluteLink(link) {
  return location.protocol + '//' + location.host + link;
}

export function toParam(params) {
  return flow(
    toPairs,
    map(v => `${v[0]}=${encodeURIComponent(v[1])}`),
    join('&')
  )(params);
}
