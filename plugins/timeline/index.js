/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'timeline', (
  _,
  modelsEntry
) => {

  return {
    explore: timelineExplore
  };

  function timelineExplore(timeline, limit) {
    const queries = createBatchCategoriesQuery(timeline, limit);
    return Promise.all(queries)
      .then(result => groupResultByCategory(result));
  }

  function groupResultByCategory(results) {
    return _(results)
        .flatten()
        .compact()
        .groupBy('category')
        .value();
  }

  function createBatchCategoriesQuery(timeline, limit) {
    return _.map(timeline, (latest, category) => {
      const q = {
        category,
        published: {
          $lt: latest
        }
      };
      return modelsEntry
        .find(q)
        .sort({published: -1})
        .limit(limit);
    });
  }

})
