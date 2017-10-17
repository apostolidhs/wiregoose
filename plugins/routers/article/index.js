/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesArticle', (
  q,
  _,
  config,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  krkParameterValidator,
  articleMining,
  articleMiningExtractContent,
  modelsEntry
) => {
  let lastCachedData;
  let lastCachedArticleId;

  return {
    register
  };

  function register(app, opts) {
    app.get(`/${config.API_URL_PREFIX}/article/mining/fetch`, [
      krkMiddlewarePermissions.check('ADMIN'),
      middlewareFetchParameterValidator,
      middlewareFetchController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(`/${config.API_URL_PREFIX}/article/mining/cachedFetch/entry/:id`, [
      krkMiddlewarePermissions.check('FREE'),
      middlewareCachedFetchParameterValidator,
      middlewareCachedFetchController,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  function middlewareFetchParameterValidator(req, res, next) {
    res.locals.params.q = krkParameterValidator.validations.paramUrlQuery(req);
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareFetchController(req, res, next) {
    const url = res.locals.params.q;
    articleMiningExtractContent.extract(url)
      .then(data => res.locals.data = data)
      .then(() => next())
      .catch(reason => {
        res.locals.errors.add('ARTICLE_MINING_FAIL', reason);
        next(true);
      });
  }

  function middlewareCachedFetchParameterValidator(req, res, next) {
    res.locals.params.entryId = krkParameterValidator.validations.paramId(req);
    res.locals.params.relatedArticles = req.sanitizeQuery('relatedArticles').toString() === 'true';
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareCachedFetchController(req, res, next) {
    const {entryId, relatedArticles} = res.locals.params;

    if (lastCachedArticleId === entryId) {
      res.locals.data = lastCachedData;
      return next();
    }

    res.locals.data = {};
    const fetchAllPrms = [
      articleMining.cachedExtraction(entryId)
        .then(data => res.locals.data.article = data)
    ];

    if (relatedArticles) {
      fetchAllPrms.push(
        modelsEntry.getRelatedEntriesById(entryId, 3)
          .then(data => res.locals.data.relatedEntries = data)
      );
    }

    q.all(fetchAllPrms)
      .then(() => {
        lastCachedData = res.locals.data;
        lastCachedArticleId = entryId;
        next();
      })
      .catch(reason => {
        res.locals.errors.add('UNEXPECTED', reason);
        next(true);
      });
  }

});
