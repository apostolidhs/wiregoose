/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesRssFeedFetchRssFeed', (
  _,
  $mongoose,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  config,
  rssTranslator
) => {

  return {
    register
  };

  function register(app) {
    app.get(`/${config.API_URL_PREFIX}/rssFeed/fetch`, [
      krkMiddlewarePermissions.check('ADMIN'),
      middlewareParameterValidator,
      middlewareController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    function middlewareParameterValidator(req, res, next) {
      res.locals.params.q = krkParameterValidator.validations.paramUrlQuery(req);
      krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
    }

    function middlewareController(req, res, next) {
      const url = res.locals.params.q;
      rssTranslator.translateFromUrl(url, {provider: {name: 'mockProvider'}, lang: config.SUPPORTED_LANGUAGES[0], category: config.CATEGORIES[0], _id: new $mongoose.Types.ObjectId()})
        .then(entries => res.locals.data = entries)
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('RSS_FEED_FETCH_FAIL', reason);
          next(true);
        });
    }
  }

});
