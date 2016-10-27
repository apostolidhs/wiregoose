/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'routesRssFeedFetchRssFeed', (
  $_,
  config,
  parameterValidator,
  rssTranslator,
  middlewarePermissions,
  middlewareResponse
) => {

  return {
    register
  };

  function register(app) {
    app.get(`/${config.API_URL_PREFIX}/rssFeed/fetch`, [
      middlewarePermissions.check('ADMIN'),
      middlewareParameterValidator,
      middlewareController,
      middlewareResponse.success,
      middlewareResponse.fail
    ]);

    function middlewareParameterValidator(req, res, next) {
      res.locals.params.q = parameterValidator.validations.paramUrlQuery(req);
      parameterValidator.checkForErrors(res.locals.params, req, res, next);
    }

    function middlewareController(req, res, next) {
      const url = res.locals.params.q;
      rssTranslator.translateFromUrl(url, 'mockProvider')
        .then(entries => res.locals.data = entries)
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('RSS_FEED_FETCH_FAIL', reason);
          next(true);
        });
    }
  }

});