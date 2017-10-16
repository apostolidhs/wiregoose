/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesEntry', (
  _,
  config,
  krkCrudGeneratorUrls,
  krkDbMongooseBinders,
  krkMiddlewarePermissions,
  krkMiddlewareParameterValidator,
  krkMiddlewareResponse,
  modelsEntry
) => {

  return {
    register
  };

  function register(app) {
    var crudUrls = krkCrudGeneratorUrls(config.API_URL_PREFIX);

    app.get(crudUrls.retrieveAll(modelsEntry.modelName) + '/authors', [
      krkMiddlewarePermissions.check('FREE'),
      krkMiddlewareParameterValidator.crud.retrieveAll(modelsEntry),
      middlewareRetrieveAllAuthors,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);

    app.get(crudUrls.retrieve(modelsEntry.modelName) + '/related', [
      krkMiddlewarePermissions.check('FREE'),
      krkMiddlewareParameterValidator.crud.retrieve(modelsEntry),
      middlewareGetRelatedEntries,
      krkMiddlewareResponse.success,
      krkMiddlewareResponse.fail
    ]);
  }

  function middlewareRetrieveAllAuthors(req, res, next) {
    const pagination = res.locals.params.pagination;

    const cursor = modelsEntry.find()
      .select({ 'author': 1, '_id': 0})
      .where('author')
        .ne(null);

    if (pagination) {
      krkDbMongooseBinders.appliers.applyPagination(cursor, pagination);
    }

    cursor
      .then((data) => {
        res.locals.data = data;
        next();
      })
      .catch((reason) => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });
  }

  function middlewareGetRelatedEntries(req, res, next) {
    const entryId = res.locals.params.id;
    modelsEntry.getRelatedEntriesById(entryId, 3)
      .then((data) => {
        res.locals.data = data;
        next();
      })
      .catch((reason) => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });
  }

});
