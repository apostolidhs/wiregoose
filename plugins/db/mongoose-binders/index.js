/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'dbMongooseBinders', ($_, $mongoose, logger, modelsApp) => {

  return {
    create,
    findByIdAndUpdate,
    findById,
    find,
    count,
    remove,

    getAppInfo,
    updateAppInfo
  };

  function getAppInfo() {
    return find(modelsApp).then($_.first);
  }

  function updateAppInfo(data) {
    return getAppInfo()
            .then(appInfo => findByIdAndUpdate(modelsApp, appInfo._id, data));
  }

  function create(model, record) {
    return model.create(record);
  }

  function findByIdAndUpdate(model, id, record) {
    return model.findByIdAndUpdate(id, record, {new: true});
  }

  function findById(model, id) {
    // mongoose autopopulate is not working for findById
    return model.findOne({_id: id});
  }

  function find(model, opts) {
    const pagination = opts && opts.pagination;

    const cursor = model.find();
    if (pagination) {
      if (pagination.page) {
        logger.assert(pagination.count > 0);
        cursor.skip(pagination.page * pagination.count)
          .limit(pagination.count);
      }
      if (pagination.sortBy) {
        cursor.sort($_.fromPairs([[pagination.sortBy, pagination.asc ? 1 : -1]]));
      }
    }

    return cursor;
  }

  function count(model) {
    return model.count();
  }

  function remove(model, id) {
    return model.remove({_id: id});
  }


});
