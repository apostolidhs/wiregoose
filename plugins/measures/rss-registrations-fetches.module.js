/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'measuresRssRegistrationsFetches', (
  _,
  modelsEntry,
  modelsRssRegistration
) => {

  return {
    measure
  };

  function measure() {
    const until = _.now();
    const from = until - (30 * 24 * 60 * 60 * 1000);
    const agg = [
      {
      $match:
       {
      created: {
        $lt: new Date(until),
        $gt: new Date(from)
      }
       }
    },
      {$group: {
        _id: "$registration",
        total: {$sum: 1}
      }}
    ];

    return Promise.all([
      modelsEntry.aggregate(agg),
      modelsRssRegistration.find()
    ]).then(([regsTotal, regs]) => {
      const regsById = _.keyBy(regs, reg => reg._id);
      const regByProvider = {};
      _.each(regsTotal, regTotal => {
        const reg = regsById[regTotal._id];
        if (reg) {
          const regStatistic = {
            total: regTotal.total,
            category: reg.category,
            link: reg.link
          };
          const provider = reg.provider.name;
          const providers = regByProvider[provider] || (regByProvider[provider] = []);
          providers.push(regStatistic);
        }
      });
      return regByProvider;
    });
  }

});
