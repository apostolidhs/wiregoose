/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesCrud', (
  $_,
  crudGenerator,
  modelsArticle,
  modelsCategory,
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
      modelsCategory,
      modelsEntry.model,
      modelsFetchReport,
      modelsRssProvider,
      modelsRssRegistration
    ];

    $_.each(models, model => {
      const crudOpts = {
        model,
        retrieveAll: {
          permissions: 'FREE'
        },
        retrieve: {
          permissions: 'FREE'
        }
      };
      crudGenerator.create(app, crudOpts);
    });
    
    crudGenerator.createSingle(app, {
      model: modelsApp,
      retrieve: {
        permissions: 'FREE'
      }
    });
  }

});