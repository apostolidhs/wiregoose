/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareParameterValidator', ($q, $_, parameterValidator) => {

  const defaultPagination = {
    page: 1,
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

  function crudRetrieveAllValidator(model) {
    return (req, res, next) => {
      const params = paginationValidator(req);
      parameterValidator.checkForErrors(params, req, res, (hasError) => {
        if (hasError) {
          return next(hasError);
        }

        checkPossibleModelQueryParameters(model, req, res)
          .then(() => next())
          .catch(reason => {
            res.locals.errors.add('INVALID_PARAMS', reason);
            next(true);
          })
      });
    }
  }

  function checkPossibleModelQueryParameters(model, req, res) {
    const pathnames = [];
    model.schema.eachPath(pathname => {
      if (pathname.indexOf('.') === -1 && req.query[pathname]) {
        pathnames.push(pathname);
      }
    });

    const filters = {};
    const partialValidations = $_.map(pathnames, pathname => ({
      path: pathname,
      value: req.query[pathname],
      onValidate: v => filters[pathname] = v
    }));
    res.locals.params.filters = filters;

    return parameterValidator.modelPartialValidator(model, partialValidations)
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