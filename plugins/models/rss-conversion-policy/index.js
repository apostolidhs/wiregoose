/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsRssConversionPolicy', ($mongoose) => {

  const schema = new $mongoose.Schema({
    name: { type: String, required: true, unique: true }
  });

  return $mongoose.model('RssConversionPolicy', schema);

});