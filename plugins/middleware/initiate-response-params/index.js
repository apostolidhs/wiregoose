/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareInitiateResponseParams', ($_, logger, errors, config) => {

  return InitiateResponseParams;

  function InitiateResponseParams(req, res, next) {
    if (!$_.isObject(req) || !$_.isObject(res) || !$_.isFunction(next)) {
      logger.error('middlewareInitiateResponseParams should be called as a middleware function');
    }

    res.locals.errors = errors.build();
    res.locals.data = undefined;
    res.locals.params = undefined;
    res.locals.meta = {
      name: config.NAME,
      version: config.API_VERSION,
      process: $_.now()
    };

    next();
  }

});
