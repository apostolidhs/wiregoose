/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsEntry', ($mongoose, $mongooseTypeUrl) => {

  const schema = getSchema();

  return {
    model: $mongoose.model('Entry', schema),
    getByCategory
  };

  function getByCategory(categoryName, lang) {
    return $mongoose.model( 
      "Category_" + categoryName + "_lang_" + lang, 
      schema 
    );
  }

  function getSchema() {
    return new $mongoose.Schema({
      title: {type: String, required: true, maxlength: [128]},
      image: {type: $mongoose.SchemaTypes.Url, required: true},
      description: {type: String, required: true, maxlength: [512]},
      published: {type: Date, required: true},
      link: {type: $mongoose.SchemaTypes.Url, required: true},

      // this should be {type: ObjectId, ref: 'RssProvider', required: true}
      // but we really need the speed :)
      provider: {type: String, required: true} 
    });
  }
});
