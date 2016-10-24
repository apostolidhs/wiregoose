/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesRssFeedFetchRssRegistrations', (
  $_,
  config,
  middlewarePermissions,
  middlewareResponse,
  rssRegistrationsFetcher
) => {

  return {
    register
  };

  function register(app) {
    app.post(`/${config.API_URL_PREFIX}/rssFeed/fetchRegistrations`, [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator,
      middlewareController,
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    function middlewareParameterValidator(req, res, next) {
      next();
    }

    function middlewareController(req, res, next) {
      rssRegistrationsFetcher.fetch()
        .then(fetchReport => res.locals.data = fetchReport)
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('RSS_REGISTRATIONS_FETCH_FAIL', reason);
          next(true);
        });      
    }
  }

});