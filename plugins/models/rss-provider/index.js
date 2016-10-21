/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsRssProvider', ($mongoose, $mongooseTypeUrl) => {

  const schema = new $mongoose.Schema({
    name: {type: String, required: true, index: true, unique: true, maxlength: [64]},
    link: {type: $mongoose.SchemaTypes.Url, required: true}
  });

  return $mongoose.model('RssProvider', schema);

});