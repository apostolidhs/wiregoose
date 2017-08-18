/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMiningCustomExtractors', (
  _
) => {

  const extractors = {
    'skai.gr': extractSkaiGR,
    'news247.gr': extractNews247GR,
    'enikos.gr': extractEnikosGR
  };

  return {
    extract
  };

  // all changes are applied by reference in the document object
  function extract(provider, doc) {
    const extractor = extractors[provider];
    if (extractor) {
      extractor(doc);
    }
  }

  function extractSkaiGR(doc) {
    removeId(doc, 'column-sec');
    doc.querySelectorAll('.news-list').forEach((node) => {
      node.parentElement.removeChild(node);
    });
  }

  function extractNews247GR(doc) {
    removeId(doc, 'leftColumn', 'footer', 'disqus_thread');
    removeClassName(doc, 'more_news_art_container');
  }

  function extractEnikosGR(doc) {
    removeId(doc, 'readmore-wrapper');
    removeClassName(doc, 'main-sidebar', 'footer-wrap', 'social-share', 'comments-header', 'disqus_thread', 'relative-articles-wrapper', 'main-header');
    removeTag(doc, 'meta', 'footer');
  }

  function removeId(doc, ...ids) {
    _.each(ids, id => {
      const el = doc.getElementById(id);
      if (el) {
        el.parentElement.removeChild(el);
      }
    });
  }

  function removeClassName(doc, ...classNames) {
    _.each(classNames, className => {
      const els = doc.getElementsByClassName(className);
      while (els.length) {
        els[0].parentElement.removeChild(els[0]);
      }
    });
  }

  function removeTag(doc, ...tags) {
    _.each(tags, tag => {
      const els = doc.getElementsByTagName(tag);
      while (els.length) {
        els[0].parentElement.removeChild(els[0]);
      }
    });
  }

});
