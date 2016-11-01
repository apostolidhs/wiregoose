/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareParameterValidator', ($q, $_, parameterValidator) => {

  const defaultPagination = {
    page: 0,
    count: 50
  };

  return {
    crud: {
      retrieve: crudRetrieveValidator,
      retrieveAll: crudRetrieveAllValidator,
      create: crudCreateValidator,
      update: crudUpdateValidator,
      delete: crudDeleteValidator
    },
    paginationValidator,
    modelValidator
  };

  function crudRetrieveValidator() {
    return idValidator
  }

  function crudRetrieveAllValidator() {
    return (req, res, next) => {
      const params = paginationValidator(req);
      parameterValidator.checkForErrors(params, req, res, next);
    }
  }

  function crudCreateValidator(model) {
    return (req, res, next) => modelValidator(model, req, res, next);
  }

  function crudUpdateValidator(model) {     
    return (req, res, next) => {
      const onModelValidated = (error) => {
        if (error) {
          return next(true);
        }
        return idValidator(req, res, next);
      }
      modelValidator(model, req, res, onModelValidated);
    };
  }

  function crudDeleteValidator() {
    return idValidator
  }

  function idValidator(req, res, next) {
    res.locals.params.id = parameterValidator.validations.paramId(req);
    parameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function modelValidator(model, req, res, next) {     
    const recordParam = req.body[model.modelName];
    const record = new model(recordParam);
    record.validate(parameterValidator.checkForMongoValidationErrors(req, res, next, () => {
      res.locals.params[model.modelName] = recordParam;    
      next();
    }));
  }

  function paginationValidator(req) {
    const validators = parameterValidator.partialValidations(req);
    const pagination = $_.defaults({
      page: validators.queryPage(),
      count: validators.queryCount(),
      sortBy: validators.querySortBy(),
      asc: validators.queryAsc()
    }, defaultPagination);

    const params = {
      pagination
    };

    return params;
  }

});