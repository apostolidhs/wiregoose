/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareCrudController', ($_, $q, dbMongooseBinders) => {

  return {
    create: createCtrl,
    update: updateCtrl,
    retrieve: retrieveCtrl,
    retrieveAll: retrieveAllCtrl,
    delete: deleteCtrl,
    
    singleRetrieve: singleRetrieveCtrl,
    singleUpdate: singleUpdateCtrl 
  };

  function createCtrl(model) {
    return (req, res, next) => {
      const record = res.locals.params[model.modelName];
      performAndResponse(() =>  dbMongooseBinders.create(model, record), res, next);       
    };   
  }

  function updateCtrl(model) {
    return (req, res, next) => {
      const id = res.locals.params.id;
      const record = res.locals.params[model.modelName];
      performAndResponse(() => dbMongooseBinders.findByIdAndUpdate(model, id, record), res, next);     
    }; 
  }

  function retrieveCtrl(model) {
    return (req, res, next) => {
      const id = res.locals.params.id;
      performAndResponse(() => dbMongooseBinders.findById(model, id), res, next); 
    };
  }

  function retrieveAllCtrl(model) {
    return (req, res, next) => {
      const findOpts = {
        pagination: res.locals.params.pagination,
        filters: res.locals.params.filters
      };

      $q.all([
        dbMongooseBinders.find(model, findOpts),
        dbMongooseBinders.count(model)
      ])
      .then(resolvedPromises => {
        const data = {};
        data.content = resolvedPromises[0];
        data.total = resolvedPromises[1];
        res.locals.data = data;

        next();
      })
      .catch(reason => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });      
    };
  }

  function deleteCtrl(model) {
    return (req, res, next) => {
      const id = res.locals.params.id;
      performAndResponse(() => dbMongooseBinders.remove(model, id), res, next); 
    };
  }

  function singleRetrieveCtrl(model) {
    return (req, res, next) => {
      const ctx = () => dbMongooseBinders
                          .find(model)
                          .then($_.first);
      performAndResponse(ctx, res, next);
    };
  }

  function singleUpdateCtrl(model) {
    return (req, res, next) => {
      const updatedRecord = res.locals.params[model.modelName];
      const ctx = () => dbMongooseBinders
        .find(model)
        .then($_.first)
        .then((record) => dbMongooseBinders.findByIdAndUpdate(model, record._id, updatedRecord));
      performAndResponse(ctx, res, next);
    };
  }

  function performAndResponse(ctx, res, next) {
    ctx()
      .then(data => {
        res.locals.data = data;
        next();
      })
      .catch(reason => {
        res.locals.errors.add('DB_ERROR', reason);
        next(true);
      });     
  }
  

});
