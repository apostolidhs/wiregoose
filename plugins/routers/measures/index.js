/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesMeasures', (
  _,
  config,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  krkParameterValidator,
  measuresSucceededFetchesPerPeriod
) => {

  return {
    register
  };

  function register(app, opts) {
    app.get(`/${config.API_URL_PREFIX}/measures/succeededFetchesPerPeriod`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareParameterValidator,
      middlewareController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  function middlewareParameterValidator(req, res, next) {
    req.checkQuery('days').isInt({min: 0, max: 366});
    req.checkQuery('lang').isLang();
    res.locals.params.days = req.sanitizeQuery('days').toInt();
    res.locals.params.lang = req.sanitizeQuery('lang').toString();
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareController(req, res, next) {
    const days = res.locals.params.days;
    const lang = res.locals.params.lang;
    measuresSucceededFetchesPerPeriod.measure(days, lang)
      .then(data => res.locals.data = data)
      .then(() => next())
      .catch(reason => {
        res.locals.errors.add('MEASURES_FAILED', reason);
        next(true);
      });
  }

});
