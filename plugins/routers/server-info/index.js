/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesServerInfo', (router, config, middlewareResponse) => {
  router.get('/info', [
    serverInfoRouter,
    middlewareResponse.success,
    middlewareResponse.fail
  ]);

  function serverInfoRouter(req, res, next) {
    const info = {
      'currentVersion': config.API_VERSION
    };
    res.locals.data = info;

    next();
  }
});
