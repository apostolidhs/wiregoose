/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsFetchReport', ($mongoose, $mongooseIdValidator) => {

  const schema = new $mongoose.Schema({
    success: {type: Boolean, required: true},
    totalFetches: {type: Number, required: true, min: 0 },
    succeededFetches: {type: Number, required: true, min: 0 },
    started: {type: Date, required: true},
    finished: {type: Date, required: true},
    log: {type: String},
    failedFetchesLog: [
      {type: String, required: true},
      {type: $mongoose.Schema.Types.ObjectId, ref: 'RssRegistration', required: true}
    ]
  });

  schema.plugin($mongooseIdValidator);

  return $mongoose.model('FetchReport', schema);

});