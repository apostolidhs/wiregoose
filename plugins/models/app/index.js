/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsApp', ($mongoose, _) => {

  const schema = new $mongoose.Schema({
    lastRssRegistrationFetch: {type: Date, required: true}
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