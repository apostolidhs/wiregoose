/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsApp', ($mongoose, _, config) => {

  const schema = new $mongoose.Schema({
    lastRssRegistrationFetch: {type: Date, required: true},
    rssRegistrationFetchFrequency: {type: Number, required: true, default: config.RSS_REGISTRATIONS_FETCH_FREQUENT},
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
