import _ from 'lodash';

const TextUtilities = {
  ellipsis,
};

export default TextUtilities;

function ellipsis(text, size = 30, ellipsisSuffix = '...') {
  if (text.length > size) {
    let subtext = text.substring(0, size - 3);
    subtext = _.trimEnd(subtext);
    return `${subtext}${ellipsisSuffix}`;
  }
  return text;
}
