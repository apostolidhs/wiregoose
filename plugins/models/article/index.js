/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsArticle', ($mongoose, $mongooseIdValidator, $mongooseAutopopulate, config) => {

  const schema = new $mongoose.Schema({
    content: {type: String},
    contentLength: {type: Number},
    title: {type: String},
    byline: {type: String},
    error: {
      code: { type: Number },
      msg: { type: String }
    },
    link: {type: $mongoose.SchemaTypes.Url, required: true, index: true},
    entryId: {type: $mongoose.Schema.Types.ObjectId, ref: 'Entry', required: true, autopopulate: true},
    createdAt: { type: Date, expires: config.ARTICLE_MINING_EXPIRATION }
  });

  schema.plugin($mongooseIdValidator);
  schema.plugin($mongooseAutopopulate);

  return $mongoose.model('Article', schema);

});
