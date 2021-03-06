/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesTimeline', (
  _,
  $mongoose,
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
      createMiddlewareTimelineController('explore', true),
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(`/${config.API_URL_PREFIX}/timeline/category`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareCategoryParameterValidator,
      createMiddlewareTimelineController('explore'),
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(`/${config.API_URL_PREFIX}/timeline/provider`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareProviderParameterValidator,
      createMiddlewareTimelineController('provider'),
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(`/${config.API_URL_PREFIX}/timeline/registration`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareRegistrationParameterValidator,
      createMiddlewareTimelineController('registration'),
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  ////////////////////////////////////////
  // Explore
  function middlewareExploreParameterValidator(req, res, next) {
    const now = new Date();
    let hasCategoryParam = false;
    res.locals.params.timeline = _.map(config.CATEGORIES, (category) => {
      req.checkQuery(category).optional().isInt();
      const param = req.sanitizeQuery(category).toInt();
      const latest = _.isNumber(param) ? new Date(param) : now;
      if (_.isNumber(param)) {
        hasCategoryParam = true;
      }
      return {
        latest,
        fieldName: 'category',
        fieldValue: category
      };
    });
    res.locals.params.isInitialTimelineRequest = !hasCategoryParam;
    res.locals.params.limit = 1;
    checkLang(req, res);

    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  ////////////////////////////////////////
  // Category
  function middlewareCategoryParameterValidator(req, res, next) {
    let time;
    const timeline = _(config.CATEGORIES)
      .map(category => {
        req.checkQuery(category).optional().isInt();
        const timeParam = req.sanitizeQuery(category).toInt();
        const latest = _.isNumber(timeParam) ? new Date(timeParam) : undefined;
        return {
          latest,
          fieldName: 'category',
          fieldValue: category
        };
      })
      .filter(timeline => timeline.latest !== undefined)
      .value();

    if (_.isEmpty(timeline)) {
      res.locals.errors.add('INVALID_PARAMS');
      return next(true);
    }

    res.locals.params.timeline = timeline;
    res.locals.params.limit = 16;
    checkLang(req, res);

    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareProviderParameterValidator(req, res, next) {
    checkLang(req, res);
    const timeline = _(req.query)
      .keys()
      .map(key => {
        const timeParam = req.sanitizeQuery(key).toInt();
        const latest = _.isNumber(timeParam) && !_.isNaN(timeParam) ? new Date(timeParam) : undefined;
        return {
          latest,
          fieldName: 'provider',
          fieldValue: key
        };
      })
      .filter(timeline => timeline.latest !== undefined)
      .value();

    if (_.isEmpty(timeline)) {
      res.locals.errors.add('INVALID_PARAMS');
      return next(true);
    }

    res.locals.params.timeline = timeline;
    res.locals.params.limit = 16;

    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareRegistrationParameterValidator(req, res, next) {
    const timeline = _(req.query)
      .keys()
      .map(key => {
        if (!$mongoose.Types.ObjectId.isValid(key)) {
          return;
        }
        const timeParam = req.sanitizeQuery(key).toInt();
        const latest = _.isNumber(timeParam) ? new Date(timeParam) : undefined;
        return {
          latest,
          fieldName: 'registration',
          fieldValue: new $mongoose.Types.ObjectId(key)
        };
      })
      .filter(timeline => timeline && timeline.latest !== undefined)
      .value();

    if (_.isEmpty(timeline)) {
      res.locals.errors.add('INVALID_PARAMS');
      return next(true);
    }

    res.locals.params.timeline = timeline;
    res.locals.params.limit = 16;
    checkLang(req, res);

    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function createMiddlewareTimelineController(name, isExplore) {
    let cachedTimeline;
    let lastCachedUpdate = _.now();
    const cacheUpdatePeriod = 15 * 60 * 1000;
    return (req, res, next) => {
      const {limit, lang, isInitialTimelineRequest} = res.locals.params;
      const timelineParams = res.locals.params.timeline;

      if (isInitialTimelineRequest && lang === 'gr' && isExplore && cachedTimeline) {
        if (lastCachedUpdate + cacheUpdatePeriod > _.now()) {
          res.locals.data = cachedTimeline;
          return next();
        } else {
          cachedTimeline = undefined;
        }
      }

      timeline[name](timelineParams, lang, limit)
        .then((feeds) => {
          res.locals.data = feeds;
          if (isInitialTimelineRequest && lang === 'gr' && isExplore) {
            cachedTimeline = feeds;
            lastCachedUpdate = _.now();
          }
        })
        .then(() => next())
        .catch(reason => {
          res.locals.errors.add('UNEXPECTED', reason);
          next(true);
        });
    }
  }

  function checkLang(req, res) {
    req.checkQuery('lang').optional().isLang();
    res.locals.params.lang = req.sanitizeQuery('lang').toString()
      || config.SUPPORTED_LANGUAGES[0];
  }
});
