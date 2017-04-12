/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsRssProvider', ($mongoose, $mongooseTypeUrl) => {

  const schema = new $mongoose.Schema({
    name: {type: String, required: true, index: true, unique: true, maxlength: [64]},
    link: {type: String, required: true}
  });

  return $mongoose.model('RssProvider', schema);

});
