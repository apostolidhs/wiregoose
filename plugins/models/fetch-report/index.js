/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsFetchReport', ($mongoose, $mongooseIdValidator, $mongooseAutopopulate) => {

  const schema = new $mongoose.Schema({
    success: {type: Boolean, required: true},
    totalFetches: {type: Number, required: true, min: 0 },
    succeededFetches: {type: Number, required: true, min: 0 },
    started: {type: Date, required: true},
    finished: {type: Date, required: true},
    log: {type: String},
    failedFetches: [
      {error: {type: $mongoose.Schema.Types.Mixed, required: true}},
      {rssRegistration: {type: $mongoose.Schema.Types.ObjectId, ref: 'RssRegistration', required: true, autopopulate: true}}
    ]
  });

  schema.plugin($mongooseAutopopulate);
  schema.plugin($mongooseIdValidator);

  return $mongoose.model('FetchReport', schema);

});