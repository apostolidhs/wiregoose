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
    const filters = opts && opts.filters;

    let q;
    if (filters) {
      q = $_.transform(filters, (result, value, key) => {
        if (!($_.isNil(value) || ($_.isString(value) && !value))) {
          result[key] = valueToFilter(value);
        }
      }, {});
    }

    const cursor = model.find(q);

    if (pagination) {
      if (pagination.page) {
        logger.assert(pagination.count > 0);
        cursor.skip((pagination.page - 1) * pagination.count)
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

  function valueToFilter(value) {
    if ($_.isString(value)) {
      return new RegExp(value, "i");
    } else if ($_.isNumber(value) || $_.isBoolean(value)) {
      return value;
    } else if ($_.isDate(value)) {
      return {
        $lte: new Date(value.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week range
        $gte: value
      };
    } else {
      logger.assert(false, `Unsupported value type: ${value}`);
    }
  }
});
