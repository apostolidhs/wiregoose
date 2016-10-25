/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsEntry', ($_, $q, $moment, $mongoose, $mongooseTypeUrl) => {

  const schema = getSchema();

  schema.methods.findLatestEntryByProvider = findLatestEntryByProvider; 
  schema.methods.findDuplicateEntry = findDuplicateEntry;
  schema.statics.saveAvoidingDuplications = saveAvoidingDuplications;

  return {
    model: $mongoose.model('Entry', schema),
    getByCategoryLang
  };

  function getByCategoryLang(categoryName, lang) {
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
      author: {type: String, maxlength: [128]},
      // this should be {type: ObjectId, ref: 'RssProvider', required: true}
      // but we really need the speed :)
      provider: {type: String, required: true}
    });
  }

  function findLatestEntryByProvider(model) {
    return model.find({provider: this.provider}).sort({published : -1}).limit(1).then($_.first);
  }

  function findDuplicateEntry(model, fromDate) {
    const q = {
      published: {
        $gte: fromDate
      },
      title: this.title
    };
    return model.find(q).limit(1);
  }

  function saveAvoidingDuplications(entries) {
    const olderEntry = $_.minBy(entries, entry => entry.published.getTime());
    const promiseOfDuplicateFind = $_.map(entries, entry => entry.findDuplicateEntry(this, olderEntry.published));

    return $q.all(promiseOfDuplicateFind)
      .then(duplications => $_.map(duplications, (duplication, idx) => {
        if ($_.isEmpty(duplication)) {
          return this.create(entries[idx]);
        }
      }))
      .then(duplications => $_.compact(duplications));     

  }

});
