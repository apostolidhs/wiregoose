/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'routesInterests', (
  _,
  config,
  $mongoose,
  modelsUserInterestsTypes,
  krkParameterValidator,
  krkMiddlewarePermissions,
  krkMiddlewareResponse,
  krkModelsUser
) => {

  return {
    register
  };

  function register(app) {

    app.get(`/${config.API_URL_PREFIX}/user/:id/interests`, [
      krkMiddlewarePermissions.check('USER', {onlyOwner: true}),
      middlewareRetrieveInterestsParameterValidator,
      middlewareRetrieveInterestsController,
      krkMiddlewareResponse.success
    ]);

    app.post(`/${config.API_URL_PREFIX}/user/:id/interests`, [
      krkMiddlewarePermissions.check('USER', {onlyOwner: true}),
      middlewarePushInterestParameterValidator,
      middlewarePushInterestController,
      krkMiddlewareResponse.success
    ]);

    app.delete(`/${config.API_URL_PREFIX}/user/:id/interests/:interestId`, [
      krkMiddlewarePermissions.check('USER', {onlyOwner: true}),
      middlewareRemoveInterestParameterValidator,
      middlewareRemoveInterestController,
      krkMiddlewareResponse.success
    ]);

  }

  function middlewareRetrieveInterestsParameterValidator(req, res, next) {
    req.checkParams('id').isMongoId();
    res.locals.params.id = krkParameterValidator.validations.paramId(req);
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareRetrieveInterestsController(req, res, next) {
    const userId = res.locals.params.id;

    return krkModelsUser.findOne({_id: userId})
      .select({'interests': 1, '_id': 0})
      .then(data => {
        res.locals.data = {interests: data.interests || []};
        next();
      })
      .catch(reason => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });
  }

  function middlewarePushInterestParameterValidator(req, res, next) {
    req.checkBody('type').isIn(modelsUserInterestsTypes);
    req.checkBody('value').isLength({max: 64});
    req.checkBody('lang').optional().isLang();

    req.checkParams('id').isMongoId();
    res.locals.params.type = req.sanitizeBody('type').toString();
    res.locals.params.value = req.sanitizeBody('value').toString();
    res.locals.params.lang = req.sanitizeBody('lang').toString();
    res.locals.params.id = krkParameterValidator.validations.paramId(req);

    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewarePushInterestController(req, res, next) {
    const {type, value, lang, id} = res.locals.params;
    krkModelsUser.findOne({_id: id})
      .select({'interests': 1})
      .then(data => {
        const interests = data.interests && data.interests.toObject();
        const count = _.size(interests);
        if (count >= config.MAX_INTERESTS_PER_USER) {
          res.locals.errors.add('MAX_INTERESTS_PER_USER');
          return next(true);
        }
        const interest = {type, value};
        if (lang) {
          interest.lang = lang;
        }

        if (_.some(interests, i => i.type === type && i.value === value && i.lang === lang)) {
          res.locals.errors.add('ALREADY_EXIST');
          return next(true);
        }

        return krkModelsUser
          .findByIdAndUpdate(id, {'$addToSet': { interests: interest }}, {new: true})
          .then(data => {
            res.locals.data = _.find(
              data.interests,
              i => i.type === type && i.value === value && i.lang === lang
            );
            next();
          })
      })
      .catch(reason => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });
  }

  function middlewareRemoveInterestParameterValidator(req, res, next) {
    req.checkParams('id').isMongoId();
    res.locals.params.interestId = req.sanitizeParams('interestId').toString();
    res.locals.params.id = krkParameterValidator.validations.paramId(req);
    krkParameterValidator.checkForErrors(res.locals.params, req, res, next);
  }

  function middlewareRemoveInterestController(req, res, next) {
    const {interestId, id} = res.locals.params;
    krkModelsUser.findByIdAndUpdate(id, {'$pull': { 'interests': { _id: interestId }}})
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
