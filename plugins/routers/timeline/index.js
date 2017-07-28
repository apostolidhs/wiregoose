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
  modelsEntry,
  timeline
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

    app.get(`/${config.API_URL_PREFIX}/timeline/category`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareCategoryParameterValidator,
      middlewareExploreController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  function middlewareExploreParameterValidator(req, res, next) {
    const now = new Date();
    res.locals.params.timeline = _.transform(config.CATEGORIES, validateCategory, {});
    res.locals.params.limit = 2;
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);

    function validateCategory(timePerCategory, category) {
      req.checkQuery(category).optional().isInt();
      const param = req.sanitizeQuery(category).toInt();
      timePerCategory[category] = _.isNumber(param) ? new Date(param) : now;
    }
  }

  function middlewareExploreController(req, res, next) {
    const timelineParams = res.locals.params.timeline;
    const limit = res.locals.params.limit;
    timeline.explore(timelineParams, limit)
      .then((feeds) => res.locals.data = feeds)
      .then(() => next())
      .catch(reason => {
        res.locals.errors.add('UNEXPECTED', reason);
        next(true);
      });
  }

  function middlewareCategoryParameterValidator(req, res, next) {
    let time;
    const category = _.find(config.CATEGORIES, category => {
      req.checkQuery(category).optional().isInt();
      time = req.sanitizeQuery(category).toInt();
      return _.isNumber(time);
    });

    if (!category) {
      res.locals.errors.add('INVALID_PARAMS', reason);
      return next(true);
    }

    const params = {};
    params[category] = new Date(time);
    res.locals.params.timeline = params;
    res.locals.params.limit = 16;
    next();
  }

});
