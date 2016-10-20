/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsProvider', ($mongoose) => {

  const schema = new $mongoose.Schema({
    name: { type: String, required: true, unique: true },
    link: { type: String, required: true}
  });

  return $mongoose.model('Provider', schema);

});