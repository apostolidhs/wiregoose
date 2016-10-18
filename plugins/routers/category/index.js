/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesCategory', (crudGenerator, modelsCategory) => {

  const crudOpts = {
    model: modelsCategory
  };
  crudGenerator.create(crudOpts);

});