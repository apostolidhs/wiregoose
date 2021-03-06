/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'measuresRssRegistrationsFetches', (
  _,
  modelsEntry,
  modelsRssRegistration,
  modelsApp
) => {

  const oneMonth = 1 * 30 * 24 * 60 * 60 * 1000;
  const measureCachingPeriod = 24 * 60 * 60 * 1000; // 1 day

  return {
    getCachedMeasures,
    startPeriodicalMeasureCaching
  };

  function startPeriodicalMeasureCaching() {
    cacheMeasure();
    setInterval(cacheMeasure, measureCachingPeriod);
  }

  function cacheMeasure() {
    return measure()
      .then(rssRegistrationFetches => modelsApp.updateAppInfo({rssRegistrationFetches})
        .then(() => rssRegistrationFetches)
      );
  }

  function getCachedMeasures({lang} = {}) {
    return modelsApp.getAppInfo().then(
      appInfo => _.transform(appInfo.rssRegistrationFetches, (regByProvider, reg) => {
        if (!lang || lang === reg.lang) {
          regByProvider[reg.provider] = (regByProvider[reg.provider] || []).concat(reg.registrations);
        }
        return regByProvider;
      }, {})
    )
  }

  function measure() {
    const until = _.now();
    const from = until - oneMonth;
    const q = [
      {
        $match: {
          created: {
            $lt: new Date(until),
            $gt: new Date(from)
          }
        }
      },
      {
        $group: {
          _id: "$registration",
          total: {$sum: 1}
        }
      }
    ];

    return Promise.all([
      modelsEntry.aggregate(q),
      modelsRssRegistration.find()
    ]).then(([regsTotal, regs]) => {

      const regsById = _.keyBy(regs, reg => reg._id);
      const regByProvider = _(regsTotal)
        .map(({total, _id}) => ({total, ...regsById[_id].toObject()}))
        .groupBy(reg => reg.provider.name)
        .map((regs, provider) => ({
          provider,
          lang: regs[0].lang,
          registrations: regs.map(({total, category, link, _id}) => ({total, category, link, _id}))
        }))
        .value();

      return regByProvider;
    });
  }

});
