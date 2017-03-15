/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesTimeline', (
  _,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  config
) => {

  return {
    register
  };

  function register(app) {
    app.get(`/${config.API_URL_PREFIX}/timeline/explore`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareParameterValidator,
      middlewareController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    function middlewareParameterValidator(req, res, next) {

    }

    function middlewareController(req, res, next) {

    }
  }

});