/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsArticle', ($mongoose, $mongooseIdValidator, $mongooseTypeUrl, config) => {

  const schema = new $mongoose.Schema({
    content: {type: String, required: true},
    error: {type: String},
    created: {type: Date, default: Date.now},
    link: {type: $mongoose.SchemaTypes.Url, required: true, index: true},
    // this should be {type: ObjectId, ref: 'Category', required: true}
    // but we really need the speed :)    
    category: {type: String, required: true},
    lang: {type: String, enum: config.SUPPORTED_LANGUAGES, required: true},
    entryId: {type: $mongoose.Schema.Types.ObjectId, ref: 'Entry', required: true}
  });

  schema.plugin($mongooseIdValidator);

  return $mongoose.model('Article', schema);

});