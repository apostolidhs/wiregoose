/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareResponse', ($_, config) => {

  return {
    success,
    fail
  };

  function success(req, res, next) {
    return response(res);
  }


  function fail(err, req, res, next) {
    if (err !== true) {
      let msg;
      if (config.RUN_MODE === 'dev') {
        msg = {
          msg: err.message,
          stack: err.stack
        };
      }
      res.locals.errors.add('UNEXPECTED', msg);
      res.status(500);
    } else {
      res.status(400);
    }

    return response(res);
  }

  function response(res) {
    const meta = res.locals.meta;
    meta.process = $_.now() - meta.process;
    const errors = res.locals.errors;
    return res.json({
      meta,
      errors: errors.isEmpty() ? undefined : errors.commit(),
      data: res.locals.data
    });
  }
});
