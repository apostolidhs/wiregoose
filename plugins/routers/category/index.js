/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesCategory', (crudGenerator, modelsCategory) => {

  const crudOpts = {
    model: modelsCategory,
    retrieveAll: {
      permissions: 'FREE'
    },
    retrieve: {
      permissions: 'FREE'
    }
  };
  crudGenerator.create(crudOpts);

});