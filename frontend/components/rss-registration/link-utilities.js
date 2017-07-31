import _ from 'lodash';

export default function getRegistrationFromLink(link) {
  const dashTitle = decodeURI(link);
  const splitedTitle = _.split(dashTitle, '-');
  if (_.size(splitedTitle) !== 4) {
    return;
  }
  return {
    provider: splitedTitle[0],
    category: splitedTitle[1],
    lang: splitedTitle[2],
    _id: splitedTitle[3]
  };
}
