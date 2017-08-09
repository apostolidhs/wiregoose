/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsPreRender', ($mongoose, $mongooseIdValidator, config) => {

  const schema = new $mongoose.Schema({
    content: {type: String},
    link: {type: String, required: true, index: true},
    createdAt: { type: Date, expires: config.PRE_RENDER_EXPIRATION },
    lastHit: { type: Date },
    hits: {type: Number, default: 0},
  });

  schema.plugin($mongooseIdValidator);

  return $mongoose.model('PreRender', schema);

});
