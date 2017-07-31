/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'timeline', (
  _,
  modelsEntry
) => {

  return {
    explore: timelineExplore,
    provider: timelineProvider,
    registration: timelineRegistration
  };

  ////////////////////////////////////////
  // Explore (Category)
  function timelineExplore(timeline, limit) {
    const queries = createBatchQueryBy(timeline, limit);
    return Promise.all(queries)
      .then(result => groupResultBy('category', result));
  }

  ////////////////////////////////////////
  // Provider
  function timelineProvider(timeline, limit) {
    const queries = createBatchQueryBy(timeline, limit);
    return Promise.all(queries)
      .then(result => groupResultBy('provider', result));
  }

  ////////////////////////////////////////
  // Registration
  function timelineRegistration(timeline, limit) {
    const queries = createBatchQueryBy(timeline, limit);
    return Promise.all(queries)
      .then(result => groupResultBy('registration', result));
  }

  function createBatchQueryBy(timeline, limit) {
    return _.map(timeline, (entry) => {
      const q = {
        published: {
          $lt: entry.latest
        }
      };
      q[entry.fieldName] = entry.fieldValue;
      return modelsEntry
        .find(q)
        .sort({published: -1})
        .limit(limit);
    });
  }

  function groupResultBy(name, results) {
    return _(results)
        .flatten()
        .compact()
        .groupBy(name)
        .value();
  }

})
