/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesTimeline', (
  _,
  config,
  krkCrudGeneratorUrls,
  krkDbMongooseBinders,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareParameterValidator,
  krkMiddlewareResponse,
  modelsEntry
) => {

  return {
    register
  };

  function register(app) {
    app.get(`/${config.API_URL_PREFIX}/timeline/explore`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareExploreParameterValidator,
      middlewareExploreController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  function middlewareExploreParameterValidator(req, res, next) {
    const now = new Date();
    res.locals.params.timeline = _.transform(config.CATEGORIES, validateCategory, {});
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);

    function validateCategory(timeline, category) {
      req.checkQuery(category).optional().isInt();
      const param = req.sanitizeQuery(category).toInt();
      timeline[category] = param === undefined ? now : new Date(param);
    }
  }

  function middlewareExploreController(req, res, next) {
    const timeline = res.locals.params.timeline;
    const queries = createBatchCategoriesQuery(timeline);
    Promise.all(queries)
      .then(results => {
        res.locals.data = _(results)
          .flatten()
          .compact()
          .groupBy('category')
          .value();
      })
      .then(() => next())
      .catch(reason => {
        res.locals.errors.add('UNEXPECTED', reason);
        next(true);
      });

    function createBatchCategoriesQuery(timeline) {
      return _.map(timeline, (latest, category) => {
        const q = {
          category,
          published: {
            $lt: latest
          }
        };
        return modelsEntry
          .find(q)
          .sort({published: -1})
          .limit(2);
      });
    }
  }

});
