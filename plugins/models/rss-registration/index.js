/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsRssRegistration', ($mongoose, $mongooseIdValidator) => {

  const ObjectId = $mongoose.Schema.Types.ObjectId;
  const schema = new $mongoose.Schema({
    category: {type: ObjectId, ref: 'Category', required: true},	
    link: { type: String, required: true },
    conversionPolicy: { type: ObjectId, ref: 'RssConversionPolicy', required: true },
    lang: { type: ObjectId, ref: 'Language', required: true },
    provider: { type: ObjectId, ref: 'RssProvider', required: true }
  });

  schema.plugin($mongooseIdValidator);
  
  return $mongoose.model('RssRegistration', schema);

});