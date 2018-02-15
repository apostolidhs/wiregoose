/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsApp', ($mongoose, _, config) => {

  const rssRegistrationFetchesSchema = new $mongoose.Schema({
    lang: {type: String, enum: config.SUPPORTED_LANGUAGES},
    provider: {type: String},
    registrations: [{
      total: {type: Number},
      category: {type: String, enum: config.CATEGORIES},
      link: {type: $mongoose.SchemaTypes.Url}
    }]
  });

  const schema = new $mongoose.Schema({
    lastRssRegistrationFetch: {type: Date, required: true},
    rssRegistrationFetchFrequency: {type: Number, required: true, default: config.RSS_REGISTRATIONS_FETCH_FREQUENT},
    rssRegistrationFetches: [rssRegistrationFetchesSchema]
  });

  schema.statics.getAppInfo = getAppInfo;
  schema.statics.updateAppInfo = updateAppInfo;

  return $mongoose.model('App', schema);

  function getAppInfo() {
    return this.find().then(_.first);
  }

  function updateAppInfo(data) {
    return this.getAppInfo()
            .then((appInfo) => this.findByIdAndUpdate(appInfo._id, data));
  }

});
