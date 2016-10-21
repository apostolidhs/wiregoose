/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsRssRegistration', ($mongoose, $mongooseIdValidator, $mongooseTypeUrl, config, rssTranslator) => {

  const ObjectId = $mongoose.Schema.Types.ObjectId;
  const schema = new $mongoose.Schema({
    category: {type: ObjectId, ref: 'Category', required: true},	
    link: {type: $mongoose.SchemaTypes.Url, required: true},
    conversionPolicy: {type: String, enum: rssTranslator.supportedConversionPolicies, required: true},
    lang: {type: String, enum: config.SUPPORTED_LANGUAGES, required: true},
    provider: {type: ObjectId, ref: 'RssProvider', required: true}
  });

  schema.plugin($mongooseIdValidator);
  
  return $mongoose.model('RssRegistration', schema);

});