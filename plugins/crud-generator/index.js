/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'crudGenerator', (
  $_,
  config,
  middlewareParameterValidator,
  middlewarePermissions,
  middlewareCrudController,
  middlewareResponse,
  crudGeneratorUrls
) => {

  return {
    create,
    createSingle
  };

  function create(app, customOpts) {
    const opts = $_.defaultsDeep(customOpts, getDefaultOptions());
    const model = opts.model;
    if (!model) {
      throw new Error('invalid model argument');
    }

    app.get(crudGeneratorUrls.retrieve(model.modelName), [
      middlewarePermissions.check(opts.retrieve.permissions),
      middlewareParameterValidator.crud.retrieve(),
      middlewareCrudController.retrieve(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.get(crudGeneratorUrls.retrieveAll(model.modelName), [
      middlewarePermissions.check(opts.retrieveAll.permissions),
      middlewareParameterValidator.crud.retrieveAll(model),
      middlewareCrudController.retrieveAll(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.post(crudGeneratorUrls.create(model.modelName), [
      middlewarePermissions.check(opts.create.permissions),
      middlewareParameterValidator.crud.create(model),
      middlewareCrudController.create(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.put(crudGeneratorUrls.update(model.modelName), [
      middlewarePermissions.check(opts.update.permissions),
      middlewareParameterValidator.crud.update(model),
      middlewareCrudController.update(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.delete(crudGeneratorUrls.delete(model.modelName), [
      middlewarePermissions.check(opts.delete.permissions),
      middlewareParameterValidator.crud.delete(model),
      middlewareCrudController.delete(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);
  }

  function createSingle(app, customOpts) {
    const opts = $_.defaultsDeep(customOpts, getDefaultOptions());
    const model = opts.model;
    if (!model) {
      throw new Error('invalid model argument');
    }

    app.get(crudGeneratorUrls.urlWithoutId(model.modelName), [
      middlewarePermissions.check(opts.retrieve.permissions),
      // there is nothing to validate :)
      middlewareCrudController.singleRetrieve(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    app.put(crudGeneratorUrls.urlWithoutId(model.modelName), [
      middlewarePermissions.check(opts.retrieve.permissions),
      (req, res, next) => middlewareParameterValidator.modelValidator(model, req, res, next),
      middlewareCrudController.singleUpdate(model),
      middlewareResponse.success,
      middlewareResponse.fail
    ]);    
  }

  function getDefaultOptions() {
    return {
      retrieveAll: {
        permissions: 'ADMIN'
      },
      retrieve: {
        permissions: 'ADMIN'
      },
      create: {
        permissions: 'ADMIN'
      },
      update: {
        permissions: 'ADMIN'
      },
      delete: {
        permissions: 'ADMIN'
      }
    };
  }

});