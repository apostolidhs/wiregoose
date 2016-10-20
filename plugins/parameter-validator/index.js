/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'parameterValidator', ($_, $expressValidator, logger) => {

  // $expressValidator.validator.toMongoSafeString = function(input) {
  //   const str = this.toString(input);
  //   if ($_.indexOf(str, '$') !== -1) {

  //   }
  //   console.log('test', str);
  // };

  return {
    validations: getValidations(),
    partialValidations: getValidations,
    checkForErrors,
    checkForMongoValidationErrors
  };

  function getValidations(rootReq) {
    return {
      // temporary for example
      // email: (req) => {
      //   req.checkBody('email').isEmail();
      //   return req.sanitize('email').normalizeEmail();
      // },
      // username: (req) => {
      //   req.checkBody('username').notEmpty().isAlpha().isLength({max: 32});
      //   req.sanitize('username').toMongoSafeString();
      //   return req.sanitize('username').toString();
      // },

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

});
