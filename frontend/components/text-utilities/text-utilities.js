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

export function createLink(name, id) {
  const dashTitle = _(name)
    .split(/[^\wΆΈ-ϗἀ-῾]+/gi)//.split(/\W+/)
    .compact()
    .join('-')
    .toLowerCase();
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

