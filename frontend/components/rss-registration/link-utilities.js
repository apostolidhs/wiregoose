import split from 'lodash/split';
import size from 'lodash/size';

export default function getRegistrationFromLink(link) {
  const dashTitle = decodeURI(link);
  const splitedTitle = split(dashTitle, '-');
  if (size(splitedTitle) !== 4) {
    return;
  }
  return {
    provider: splitedTitle[0],
    category: splitedTitle[1],
    lang: splitedTitle[2],
    _id: splitedTitle[3]
  };
}
