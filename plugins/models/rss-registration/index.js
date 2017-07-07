/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsRssRegistration', (
  $mongoose,
  $mongooseIdValidator,
  $mongooseAutopopulate,
  $mongooseTypeUrl,
  config,
  rssTranslator
) => {

  const ObjectId = $mongoose.Schema.Types.ObjectId;
  const schema = new $mongoose.Schema({
    category: {type: String, enum: config.CATEGORIES, required: true},
    link: {type: $mongoose.SchemaTypes.Url, required: true},
    lang: {type: String, enum: config.SUPPORTED_LANGUAGES, required: true},
    provider: {type: ObjectId, ref: 'RssProvider', required: true, autopopulate: true}
  });

  schema.plugin($mongooseAutopopulate);
  schema.plugin($mongooseIdValidator);

  return $mongoose.model('RssRegistration', schema);

});
