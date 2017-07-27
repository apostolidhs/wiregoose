export function createArticleLink({ _id, title }) {
  const dashTitle = title.toLowerCase().split(' ').join('-');
  const url = encodeURI(dashTitle);
  return `/article/${url}-${_id}`;
}

export function getArticleIdFromLink(link) {
  const lastDash = link.lastIndexOf('-');
  return lastDash === -1 ? '' : link.substring(lastDash + 1);
}
