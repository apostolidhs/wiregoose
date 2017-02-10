/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsApp', ($mongoose) => {

  const schema = new $mongoose.Schema({
    lastRssRegistrationFetch: {type: Date, required: true}
  });

  return $mongoose.model('App', schema);

});

  // function getAppInfo() {
  //   return find(krkModelsApp).then(_.first);
  // }

  // function updateAppInfo(data) {
  //   return getAppInfo()
  //           .then(function(appInfo) {
  //             return findByIdAndUpdate(krkModelsApp, appInfo._id, data);
  //           });
  // }