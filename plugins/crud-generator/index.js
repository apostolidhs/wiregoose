/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'crudGenerator', (
  config, 
  app, 
  middlewareParameterValidator, 
  middlewarePermissions, 
  middlewareCrudController,
  middlewareResponse, 
  crudGeneratorUrls
) => {

  return {
    create
  };

  function create(opts) {
    if (!opts.model) {
      throw new Error('invalid model argument');
    }
    app.get(crudGeneratorUrls.retrieve(opts.model.modelName), [
      middlewareParameterValidator.crud.retrieve(),
      middlewarePermissions.check('ADMIN'),
      middlewareCrudController.retrieve(opts.model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);
  }

});