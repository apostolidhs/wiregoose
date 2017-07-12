/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesCrud', (
  _,
  krkCrudGenerator,
  config,
  modelsArticle,
  modelsAuthor,
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
      modelsArticle,
      modelsAuthor,
      modelsEntry,
      modelsFetchReport,
      modelsRssProvider,
      modelsRssRegistration
    ];

    _.each(models, model => {
      const crudOpts = {
        model,
        apiUrlPrefix: config.API_URL_PREFIX,
        retrieveAll: {
          permissions: 'FREE'
        },
        retrieve: {
          permissions: 'FREE'
        }
      };
      krkCrudGenerator.create(app, crudOpts);
    });

    krkCrudGenerator.createSingle(app, {
      model: modelsApp,
      apiUrlPrefix: config.API_URL_PREFIX,
      retrieve: {
        permissions: 'FREE'
      }
    });
  }

});
