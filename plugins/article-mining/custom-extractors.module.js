/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMiningCustomExtractors', (

) => {

  const extractors = {
    'skai.gr': extractSkaiGR
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
    let el;
    el = doc.getElementById('column-sec');
    if (el) {
      el.parentElement.removeChild(el);
    }
    doc.querySelectorAll('.news-list').forEach((node) => {
      node.parentElement.removeChild(node);
    });
  }

});
