/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareCrudController', (dbMongooseBinders) => {

  return {
    create: createCtrl,
    update: updateCtrl,
    retrieve: retrieveCtrl,
    retrieveAll: retrieveAllCtrl,
    delete: deleteCtrl
  };

  function createCtrl(model) {
    return (req, res, next) => {
      const record = res.locals.params[model.modelName];
      dbMongooseBinders.create(model, record)
        .then(newRecord => {
          res.locals.data = newRecord;
          next();
        })
        .catch(reason => {
          res.locals.errors.add('DB_ERROR', reason);
          next(true);
        });      
    };   
  }

  function updateCtrl() {

  }

  function retrieveCtrl(model) {
    return (req, res, next) => {
      const id = res.locals.params.id;
      dbMongooseBinders.findById(model, id)
        .then(record => {
          res.locals.data = record;
          next();
        })
        .catch(reason => {
          res.locals.errors.add('DB_ERROR', reason);
          next(true);
        });
    };
  }

  function retrieveAllCtrl() {

  }

  function deleteCtrl() {

  }
  

});
