/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesAuthorization', (
  _,
  $passport,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  config
) => {

  return {
    register
  };

  function register(app) {
    app.post('/' + config.apiUrlPrefix + '/authorize/facebook', [
      middlewareFacebookPermissionsCheck(),
      middlewareFacebookLoginController,
      krkMiddlewareResponse.success
    ]);
  }

  function middlewareFacebookPermissionsCheck() {
    const authOptions = {
      session: false,
      failWithError: true
    };
    return $passport.authenticate('jwt', authOptions);
  }

  function middlewareFacebookLoginController(req, res, next) {
    const user = req.user;
    if (user) {
      res.locals.errors.add('UNAUTHORIZED_USER');
      return next(true);
    }

    res.locals.data = krkMiddlewarePermissions.createJWT(user);
    user.updateLoginInfo();
    next();
  }
});
