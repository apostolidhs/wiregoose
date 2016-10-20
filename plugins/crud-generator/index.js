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
    const model = opts.model; 
    if (!model) {
      throw new Error('invalid model argument');
    }

    app.get(crudGeneratorUrls.retrieve(model.modelName), [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator.crud.retrieve(),      
      middlewareCrudController.retrieve(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.get(crudGeneratorUrls.retrieveAll(model.modelName), [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator.crud.retrieveAll(),
      middlewareCrudController.retrieveAll(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);    

    app.post(crudGeneratorUrls.create(model.modelName), [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator.crud.create(model),      
      middlewareCrudController.create(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);  

    app.put(crudGeneratorUrls.update(model.modelName), [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator.crud.update(model),      
      middlewareCrudController.update(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);      

    app.delete(crudGeneratorUrls.delete(model.modelName), [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator.crud.delete(model),      
      middlewareCrudController.delete(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);      
  }

});