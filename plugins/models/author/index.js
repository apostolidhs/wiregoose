'use strict';

KlarkModule(module, 'modelsAuthor', ($mongoose, _, q) => {

  const schema = new $mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true, maxlength: [128]}
  });

  schema.statics.saveManyIfNotExist = saveManyIfNotExist;

  return $mongoose.model('Author', schema);

  function saveManyIfNotExist(docs) {
    const uniqDocs = _.uniqBy(docs, 'name');
    return q.throttle({
      list: uniqDocs,
      promiseTransformator: doc => this.create(doc),
      policy: 'allSettled'
    });
  }

});