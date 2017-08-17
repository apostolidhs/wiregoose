export default function translate(entry) {
  if (entry.published) {
    entry.published = new Date(entry.published);
  }
  if (entry.created) {
    entry.created = new Date(entry.created);
  }
  if (entry.modified) {
    entry.modified = new Date(entry.modified);
  }
  if (entry.image) {
    entry.image = decodeURIComponent(entry.image);
  }
  estimateContent(entry);
  return entry;
}

const ARTICLE_BOX_FULL = 'ARTICLE_BOX_FULL';
const ARTICLE_BOX_NO_IMAGE = 'ARTICLE_BOX_NO_IMAGE';
const ARTICLE_BOX_NO_DESCRIPTION = 'ARTICLE_BOX_NO_DESCRIPTION';

function estimateContent(entry) {
  if (!entry.image) {
    entry.boxSize = ARTICLE_BOX_NO_IMAGE;
  } else if (!entry.description) {
    entry.boxSize = ARTICLE_BOX_NO_DESCRIPTION;
  } else {
    entry.boxSize = ARTICLE_BOX_FULL;
  }
}
