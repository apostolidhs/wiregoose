import _ from 'lodash';

const metaTags = {
  description: [
    ['meta', 'name', 'description', 'content'],
    ['meta', 'itemprop', 'description', 'content'],
    ['meta', 'name', 'twitter:description', 'content'],
    ['meta', 'property', 'og:description', 'content']
  ],
  keywords: [
    ['meta', 'name', 'keywords', 'content'],
    ['meta', 'property', 'article:tag', 'content']
  ],
  title: [
    ['title'],
    ['meta', 'itemprop', 'name', 'content'],
    ['meta', 'name', 'twitter:title', 'content'],
    ['meta', 'property', 'og:title', 'content']
  ],
  image: [
    ['meta', 'name', 'thumbnail', 'content'],
    ['meta', 'itemprop', 'image', 'content'],
    ['meta', 'name', 'twitter:image:src', 'content'],
    ['meta', 'property', 'og:image', 'content']
  ],
  time: [
    ['meta', 'property', 'article:published_time', 'content']
  ],
  lang: [
    ['meta', 'property', 'og:locale', 'content']
  ],
  url: [
    ['link', 'rel', 'canonical', 'href'],
    ['meta', 'property', 'og:url', 'content']
  ]
};

export function setOptions(opts = {}) {
  const headEl = document.getElementsByTagName('head')[0];
  clearElements(headEl);
  createElements(headEl, opts);
}
//
function createElementFromMetaCategory(rootEl, metaTagCategory, value) {
  _.each(metaTags[metaTagCategory], (tags) => {
    const [tagName, attributeKey, attributeValue, content] = tags;
    let tagValue = value;
    if (metaTagCategory === 'title') {
      tagValue = `Wiregoose - ${tagValue}`;
    } else if (metaTagCategory === 'keywords') {
      tagValue = 'news,rss,rss feed,real time,online news,latest news';
      if (value) {
        tagValue += `,${value}`;
      }
    }
    const el = document.createElement(tagName);
    if (attributeKey) {
      el.setAttribute(attributeKey, attributeValue);
    }
    if (content) {
      el.setAttribute(content, tagValue);
    } else {
      const textNode = document.createTextNode(tagValue);
      el.appendChild(textNode);
    }
    rootEl.appendChild(el);
  });
}

function createElements(rootEl, opts) {
  _.each(opts, (value, metaTagCategory) => {
    createElementFromMetaCategory(rootEl, metaTagCategory, value);
  });
}

function clearElements(rootEl) {
  _.each(metaTags, (tags) => {
    _.each(tags, tag => {
      const el = queryElement(rootEl, tag[0], tag[1], tag[2]);
      if (el) {
        rootEl.removeChild(el);
      }
    });
  });
}

function queryElement(root, tagName, attributeKey, attributeValue) {
  const tagNameEls = root.getElementsByTagName(tagName);
  if (!attributeKey) {
    return tagNameEls.length > 0 ? tagNameEls[0] : undefined;
  }
  for (let i = 0; i < tagNameEls.length; ++i) {
    if (tagNameEls[i].getAttribute(attributeKey) === attributeValue) {
      return tagNameEls[i];
    }
  }
}
