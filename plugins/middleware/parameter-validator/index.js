/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareParameterValidator', (parameterValidator) => {

  return {
    crud: {
      retrieve: crudRetrieveValidator,
      create: crudCreateValidator
    }
  };

  function crudRetrieveValidator() {
    return (req, res, next) => {
      const params = {};
      params.id = parameterValidator.validations.paramId(req);
      parameterValidator.checkForErrors(params, req, res, next);
    }
  }

  function crudCreateValidator(model) {
    return (req, res, next) => {
      const params = {};      
      const recordParam = req.body[model.modelName];
      const record = new model(recordParam);
      record.validate(parameterValidator.checkForMongoValidationErrors(req, res, next, () => {
        params[model.modelName] = record;    
        res.locals.params = params;
        next();
      }));              
    }
  }

});