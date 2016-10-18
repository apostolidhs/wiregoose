/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'crudGenerator', (config, app, middlewareParameterValidator, middlewareResponse) => {

  return {
    create
  };

  function create(opts) {
    if (!opts.model) {
      throw new Error('invalid model argument');
    }
    app.get(`/${config.API_URL_PREFIX}/${opts.model.modelName.toLowerCase()}/:id`, [
      middlewareParameterValidator.crud.retrieve(),
      // middlewarePermissions.check('ADMIN'),
      // middlewareCrudController.retrieve(opts.model)
      middlewareResponse.success,
      middlewareResponse.fail
    ]);
  }

});