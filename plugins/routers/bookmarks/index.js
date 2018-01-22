/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesBookmarks', (
  _,
  config,
  $mongoose,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  krkModelsUser
) => {

  return {
    register
  };

  function register(app) {

    app.get(`/${config.API_URL_PREFIX}/user/:id/bookmarks`, [
      krkMiddlewarePermissions.check('USER', {onlyOwner: true}),
      middlewareRetrieveAllBookmarkIdsParameterValidator,
      middlewareRetrieveAllBookmarkIdsController,
      krkMiddlewareResponse.success
    ]);

    app.post(`/${config.API_URL_PREFIX}/user/:id/bookmarks/:entryId`, [
      krkMiddlewarePermissions.check('USER', {onlyOwner: true}),
      middlewareMutateBookmarksParameterValidator,
      middlewarePushBookmarkIdController,
      krkMiddlewareResponse.success
    ]);

    app.delete(`/${config.API_URL_PREFIX}/user/:id/bookmarks/:entryId`, [
      krkMiddlewarePermissions.check('USER', {onlyOwner: true}),
      middlewareMutateBookmarksParameterValidator,
      middlewareRemoveBookmarkIdController,
      krkMiddlewareResponse.success
    ]);

  }

  function middlewareRetrieveAllBookmarkIdsParameterValidator(req, res, next) {
    res.locals.params.populate = req.sanitizeQuery('populate').toString() === 'true';
    res.locals.params.id = krkParameterValidator.validations.paramId(req);
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareRetrieveAllBookmarkIdsController(req, res, next) {
    const populate = res.locals.params.populate;
    const userId = res.locals.params.id;

    let cursor = krkModelsUser.findOne({_id: userId})
      .select({'bookmarks': 1, '_id': 0});

    if (populate) {
      cursor = cursor.populate('bookmarks');
    }

    return cursor.then(data => {
      res.locals.data = {bookmarks: data.bookmarks || []};
      next();
    })
    .catch(reason => {
      res.locals.errors.add('DB_ERROR', reason);
      next(true);
    });
  }

  function middlewareMutateBookmarksParameterValidator(req, res, next) {
    req.checkParams('entryId').isMongoId();
    res.locals.params.entryId = req.sanitizeParams('entryId').toString();
    res.locals.params.id = krkParameterValidator.validations.paramId(req);
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewarePushBookmarkIdController(req, res, next) {
    const {entryId, id} = res.locals.params;
    krkModelsUser
      .aggregate(
        { $project: { bookmarks: 1 }},
        { $unwind: "$bookmarks" },
        { $group: { _id: "result", count: { $sum: 1 }}}
      )
      .then(data => {
        const count = _.get(data, '[0].count', 0);
        if (count >= config.MAX_BOOKMARKS_PER_USER) {
          res.locals.errors.add('MAX_BOOKMARKS_PER_USER');
          return next(true);
        }
        return krkModelsUser
          .findByIdAndUpdate(id, {'$addToSet': { 'bookmarks': entryId }})
          .then(data => {
            res.locals.data = true;
            next();
          })
      })
      .catch(reason => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });
  }

  function middlewareRemoveBookmarkIdController(req, res, next) {
    const {entryId, id} = res.locals.params;
    krkModelsUser.findByIdAndUpdate(id, {'$pull': { 'bookmarks': entryId }})
      .then(data => {
        res.locals.data = true;
        next();
      })
      .catch(reason => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });
  }

});
