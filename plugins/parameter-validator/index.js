/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'parameterValidator', ($q, $_, $expressValidator, logger) => {

  return {
    validations: getValidations(),
    partialValidations: getValidations,
    checkForErrors,
    checkForMongoValidationErrors,
    modelPartialValidator
  };

  function getValidations(rootReq) {
    return {
      paramUrlQuery: (req) => {
        req = rootReq || req;
        req.checkQuery('q').isURL();
        return req.sanitizeQuery('q').toString();
      },

      paramId: (req) => {
        req = rootReq || req;
        req.checkParams('id').isMongoId();
        return req.sanitizeParams('id').toString();
      },

      queryPage: (req) => {
        req = rootReq || req;
        req.checkQuery('page').optional().isInt({min: 0});
        return req.sanitizeQuery('page').toInt();
      },
      queryCount: (req) => {
        req = rootReq || req;
        req.checkQuery('count').optional().isInt({min: 1});
        return req.sanitizeQuery('count').toInt();
      },
      querySortBy: (req) => {
        req = rootReq || req;
        req.checkQuery('sortBy').optional().isAlpha();
        return req.sanitizeQuery('sortBy').toString();
      },
      queryAsc: (req) => {
        req = rootReq || req;
        return $_.has(req.query, 'asc') && req.query.asc !== 'false';
      }
    };
  }

  function checkForErrors(params, req, res, next) {
    const errors = req.validationErrors();
    if (errors) {
      res.locals.errors.add('INVALID_PARAMS', errors);
      return next(true);
    }

    res.locals.params = params;
    next();
  }

  function checkForMongoValidationErrors(req, res, onFail, onSuccess) {
      return err => {
        if (err) {
          res.locals.errors.add('INVALID_PARAMS', err && err.errors || err);
          return onFail(true);
        } else {
          return onSuccess();
        }
      }
  }

  // {path: 'v', value: v, isValid: v => v = v},
  function modelPartialValidator(model, opts) {
    const errors = $_.chain(opts)
      .map(opt => {
        const validators = model.schema.path(opt.path).validators;
        const isInvalid = $_.find(validators, validatorModel => !validatorModel.validator(opt.value));

        if (isInvalid) {
          return isInvalid.message.replace('{PATH}', opt.path);
        } else {
          opt.onValidate(opt.value);
        }
      })
      .compact()
      .value();

    if ($_.isEmpty(errors)) {
      return $q.when();
    } else {
      return $q.reject(errors);
    }
  }  

});
