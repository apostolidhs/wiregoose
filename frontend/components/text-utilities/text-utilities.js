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
