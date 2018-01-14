/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsFetchReport', ($mongoose, $mongooseIdValidator, $mongooseAutopopulate, config) => {

  const schema = new $mongoose.Schema({
    totalFetches: {type: Number, required: true, min: 0 },
    succeededFetches: {type: Number, required: true, min: 0 },
    entriesStored: {type: Number, required: true, min: 0 },
    started: {type: Date, required: true},
    finished: {type: Date, required: true},
    createdAt: { type: Date, default: Date.now, expires: config.FETCH_REPORT_EXPIRATION },
    log: {type: String},
    failedFetches: [{
      error: {type: $mongoose.Schema.Types.Mixed, required: true},
      rssRegistration: {type: $mongoose.Schema.Types.ObjectId, ref: 'RssRegistration', required: true, autopopulate: false}
    }]
  });

  schema.plugin($mongooseAutopopulate);
  schema.plugin($mongooseIdValidator);

  return $mongoose.model('FetchReport', schema);

});
