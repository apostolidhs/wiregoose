/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesCrud', (
  _,
  krkCrudGenerator,
  config,
  modelsPreRender,
  modelsArticle,
  modelsEntry,
  modelsFetchReport,
  modelsRssProvider,
  modelsRssRegistration,
  modelsApp
) => {

  return {
    register
  };

  function register(app) {
    const models = [
      [modelsPreRender],
      [modelsArticle],
      [modelsEntry],
      [modelsFetchReport],
      [modelsRssProvider, {retrieveAll: {permissions: 'FREE'}}],
      [modelsRssRegistration]
    ];

    _.each(models, reg => {
      const crudOpts = _.assignIn({
        model: reg[0],
        apiUrlPrefix: config.API_URL_PREFIX,
      }, reg[1] || {});
      krkCrudGenerator.create(app, crudOpts);
    });

    krkCrudGenerator.createSingle(app, {
      model: modelsApp,
      apiUrlPrefix: config.API_URL_PREFIX,
    });
  }

});
