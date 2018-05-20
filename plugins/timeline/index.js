/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'timeline', (
  _,
  modelsEntry
) => {

  const TIMELINE_CUSTOM = 3;

  return {
    explore: timelineExplore,
    provider: timelineProvider,
    registration: timelineRegistration,
    custom: timelineCustom
  };

  ////////////////////////////////////////
  // Explore (Category)
  function timelineExplore(timeline, lang, limit) {
    const queries = createBatchQueryBy(timeline, lang, limit);
    return Promise.all(queries)
      .then(result => groupResultBy('category', result));
  }

  ////////////////////////////////////////
  // Provider
  function timelineProvider(timeline, lang, limit) {
    const queries = createBatchQueryBy(timeline, lang, limit);
    return Promise.all(queries)
      .then(result => groupResultBy('provider', result));
  }

  ////////////////////////////////////////
  // Registration
  function timelineRegistration(timeline, lang, limit) {
    const queries = createBatchQueryBy(timeline, lang, limit);
    return Promise.all(queries)
      .then(result => groupResultBy('registration', result));
  }

  function timelineCustom(timeline, page) {
     const queries = _.map(timeline, entry => {
      const q = {[entry.fieldName]: entry.fieldValue};
      if (entry.lang) {
        q.lang = entry.lang;
      }
      return modelsEntry
        .find(q)
        .sort({published: -1})
        .skip(TIMELINE_CUSTOM * (page - 1))
        .limit(TIMELINE_CUSTOM * page);
    });

    return Promise.all(queries)
      .then(results => _(results)
        .flatten()
        .compact()
        .uniqBy(entry => entry.id)
        .value()
      );
  }

  function createBatchQueryBy(timeline, lang, limit) {
    return _.map(timeline, entry => {
      const q = {
        lang,
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
