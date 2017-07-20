/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'measuresSucceededFetchesPerPeriod', (
  _,
  modelsEntry,
  modelsRssRegistration,
  modelsRssProvider
) => {
  const oneDay = 24 * 60 * 60 * 1000;

  return {
    measure
  };

  function measure(days, lang) {
    return Promise.all([
      getMeasuredData(days, lang),
      getAllProviders(lang)
    ])
    .then(result => ({
      chart: result[0],
      providers: result[1]
    }));
  }

  function getAllProviders(lang) {
    return modelsRssRegistration.distinct('provider')
      .then(providersId =>
          modelsRssProvider
            .find({
              '_id': { $in: providersId }
            })
            .select({'name': 1, '_id': 0})
            .then(providers => _.map(providers, 'name'))
      );
  }

  function getMeasuredData(days, lang) {
    const until = _.now();
    const from = until - (days * oneDay);
    const q = {
      lang,
      created: {
        $lt: new Date(until),
        $gt: new Date(from)
      }
    };
    const cursor = modelsEntry.find(q)
      .sort({created: 1})
      .select({ 'created': 1, 'category': 1, 'provider': 1, '_id': 0});

    return cursor.then(groupResults);
  }

  function groupResults(data) {
    if (_.isEmpty(data)) {
      return;
    }
    const oldestEntry = _.first(data);
    const fromOldestEntry = Math.round(oldestEntry.created.getTime() / oneDay);
    return _(data)
      .groupBy(entry => Math.round(entry.created.getTime() / oneDay) - fromOldestEntry)
      .mapValues(entries => _.groupBy(entries, 'category'))
      .mapValues(byCategory =>
        _.mapValues(byCategory, entries => _.countBy(entries, 'provider'))
      )
      .value();
  }

});
