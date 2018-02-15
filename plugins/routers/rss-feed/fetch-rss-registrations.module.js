/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesRssFeedFetchRssRegistrations', (
  _,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  config,
  rssRegistrationsFetcher,
  measuresRssRegistrationsFetches
) => {

  return {
    register
  };

  function register(app) {
    app.post(`/${config.API_URL_PREFIX}/rssFeed/fetchRegistrations`, [
      krkMiddlewarePermissions.check('ADMIN'),
      middlewareFetchRegistrationsController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(`/${config.API_URL_PREFIX}/rssFeed/registrationFetches`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareRegistrationFetcherParameterValidator,
      middlewareRegistrationFetchesController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    function middlewareFetchRegistrationsController(req, res, next) {
      rssRegistrationsFetcher.fetch()
        .then(fetchReport => res.locals.data = fetchReport)
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('RSS_REGISTRATIONS_FETCH_FAIL', reason);
          next(true);
        });
    }

    function middlewareRegistrationFetcherParameterValidator(req, res, next) {
      req.checkQuery('lang').isLang();
      res.locals.params.lang = req.sanitizeQuery('lang').toString();
      krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
    }

    function middlewareRegistrationFetchesController(req, res, next) {
      const lang = res.locals.params.lang;
      measuresRssRegistrationsFetches.getCachedMeasures({lang})
        .then(data => {
          _.each(data, rs => _.each(rs, (r, idx) => rs[idx] = _.omit(r.toObject(), ['link'])));
          res.locals.data = data;
        })
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('MEASURES_FAILED', reason);
          next(true);
        });
    }
  }

});
