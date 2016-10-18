/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareOrchestrator', ($_, router, middlewarePermissions, middlewareResponse) => {

  const defaultOpts = getDefaultOpts();

  return {
    route
  };

  function route(endpoint, method, permissions, middlewareParameterValidator, controllerMiddleware, customOpts) {
    const opts = $_.defaults(customOpts, defaultOpts);

    const middleware = [];
    if (permissions) {
      middleware.push(middlewarePermissions.create(permissions));
    }

    if (middlewareParameterValidator) {
      middleware.push(middlewareParameterValidator);
    }

    if (controllerMiddleware) {
      middleware.push(controllerMiddleware);
    }

    middleware.push(middlewareResponse.success, middlewareResponse.fail);

    router[method](endpoint, middleware);
  }

  function getDefaultOpts() {
    return {};
  }

});
