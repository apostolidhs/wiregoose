/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesProxy', (
  _,
  $request,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  proxy,
  config
) => {
  return {
    register
  };

  function register(app) {
    app.get(`/${config.API_URL_PREFIX}/proxy/image`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareImageParameterValidator,
      middlewareImageController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(`/${config.API_URL_PREFIX}/proxy/cacheInfo`, [
      krkMiddlewarePermissions.check('ADMIN'),
      middlewareCacheInfoController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  function middlewareImageParameterValidator(req, res, next) {
    req.checkQuery('h').optional().isInt({min: 1, max: 1024});
    const h = req.sanitizeQuery('h').toInt();
    req.checkQuery('w').optional().isInt({min: 1, max: 1024});
    const w = req.sanitizeQuery('w').toInt();

    if (_.isNumber(h) && _.isNumber(w)) {
      res.locals.params.resizeImage = {h, w};
    }

    res.locals.params.q = krkParameterValidator.validations.paramUrlQuery(req);
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareImageController(req, res, next) {
    const url = res.locals.params.q;
    const resize = res.locals.params.resizeImage;
    proxy.image(url, resize)
      .then(path => res.sendFile(path))
      .catch(reason => {
        res.locals.errors.add('PROXY_FAILED', reason);
        next(true);
      });
  }

  function middlewareCacheInfoController(req, res, next) {
    proxy.getCacheInfo()
      .then(data => res.locals.data = data)
      .then(() => next())
      .catch(reason => {
        res.locals.errors.add('PROXY_FAILED', reason);
        next(true);
      });
  }
})
