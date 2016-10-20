/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'parameterValidator', ($_, $expressValidator, logger) => {

  $expressValidator.validator.toMongoSafeString = function(input) {
    const str = this.toString(input);
    if ($_.indexOf(str, '$') !== -1) {

    }
    console.log('test', str);
  };

  const validations = getValidations();

  return {
    apply,
    validations,
    checkForErrors
  };

  function apply(req, heads) {
    if (!req || !$_.isArray(heads)) {
      logger.error(`invalid arguments`);
    }

    return $_.transform(heads, (vals, head) => {
      const validator = validations[head.name];
      if (validator === undefined) {
        logger.error(`parameter (${head.name}) does not have validator`);
      }
      vals[head.name] = validator(req);
    }, {});
  }

  function getValidations() {
    return {
      email: (req) => {
        req.checkBody('email').isEmail();
        return req.sanitize('email').normalizeEmail();
      },
      username: (req) => {
        req.checkBody('username').notEmpty().isAlpha().isLength({max: 32});
        req.sanitize('username').toMongoSafeString();
        return req.sanitize('username').toString();
      },
      paramId: (req) => {
        req.checkParams('id').isMongoId();
        return req.sanitize('id').toString();
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

});
