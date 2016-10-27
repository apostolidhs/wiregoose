/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsApp', ($mongoose) => {

  const schema = new $mongoose.Schema({
    lastRssRegistrationFetch: {type: Date, required: true}
  });

  return $mongoose.model('App', schema);

});