/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'measuresArticles', (
  _,
  modelsEntry,
  modelsArticle
) => {

  return {
    measure
  };

  function measure() {
    return Promise.all([
      topViewed(),
      failedArticles()
    ])
    .then(result => ({
      topViewed: result[0],
      failed: result[1]
    }));
  }

  function topViewed() {
    return modelsEntry.find({ article: { $exists: true } })
      .sort({hits: 1})
      .select({ 'link': 1, 'hits': 1})
      .limit(20);
  }

  function failedArticles() {
    return modelsArticle.find({ error: { $exists: true } })
      .select({ 'link': 1, 'error': 1 })
      .limit(20);
  }

});
