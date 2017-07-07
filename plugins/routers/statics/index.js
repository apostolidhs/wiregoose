/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesStatics', (
  krkMiddlewareResponse,
  krkMiddlewarePermissionsRoles,
  config
) => {

  return {
    register
  };

  function register(app) {
    app.get(`/${config.API_URL_PREFIX}/statics/categories`, [
      middlewareStatic(config.CATEGORIES),
      krkMiddlewareResponse.success
    ]);
    app.get(`/${config.API_URL_PREFIX}/statics/supportedLanguages`, [
      middlewareStatic(config.SUPPORTED_LANGUAGES),
      krkMiddlewareResponse.success
    ]);
  }

  function middlewareStatic(val) {
    return (req, res, next) => {
      res.locals.data = val;
      next();
    }
  }
});
