/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'modelsEntry', (
  _,
  q,
  config,
  $moment,
  $mongoose,
  $mongooseTypeUrl,
  $mongooseCreatedmodified
) => {

  const schema = getSchema();

  schema.index({ published: 1, lang: 1, category: 1 });
  schema.index({ published: 1, lang: 1, provider: 1 });
  schema.index({ published: 1, lang: 1, provider: 1, category: 1 });

  schema.plugin($mongooseCreatedmodified.createdModifiedPlugin, {index: true});

  schema.methods.findLatestEntryByProvider = findLatestEntryByProvider;
  schema.methods.findDuplicateEntry = findDuplicateEntry;
  schema.statics.saveAvoidingDuplications = saveAvoidingDuplications;

  return $mongoose.model('Entry', schema);

  function getSchema() {
    const ObjectId = $mongoose.Schema.Types.ObjectId;
    return new $mongoose.Schema({
      title: {type: String, required: true, maxlength: [128]},
      image: {type: $mongoose.SchemaTypes.Url, validate: conditionalRequired('description')},
      description: {type: String, maxlength: [256], validate: conditionalRequired('image')},
      published: {type: Date, required: true},
      link: {type: $mongoose.SchemaTypes.Url, required: true},
      lastHit: { type: Date },
      hits: {type: Number, default: 0},
      category: {type: String, enum: config.CATEGORIES, required: true},
      lang: {type: String, enum: config.SUPPORTED_LANGUAGES, required: true},
      // this should be {type: ObjectId, ref: 'Author'}
      // but we really need the speed, part 1 :)
      author: {type: String, maxlength: [128]},
      // this should be {type: ObjectId, ref: 'RssProvider', required: true}
      // but we really need the speed, part 2 :)
      provider: {type: String, required: true},
      // this should be {type: ObjectId, ref: 'RssRegistration', required: true, populate: true}
      // but we really need the speed, part 3 :)
      registration: {type: ObjectId, ref: 'RssRegistration', required: true},

      article: {type: ObjectId, ref: 'Article'}
    });
  }

  function conditionalRequired(field) {
    return {
      msg: 'description or image is required',
      validator: function(value) {
        return value || this[field];
      }
    };
  }

  function findLatestEntryByProvider(model) {
    return model.find({provider: this.provider}).sort({published : -1}).limit(1).then(_.first);
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
    const olderEntry = _.minBy(entries, entry => entry.published.getTime());

    return q.throttle({
      list: entries,
      promiseTransformator: entry => entry.findDuplicateEntry(this, olderEntry.published)
    })
    .then(duplications => q.throttle({
      list: duplications,
      promiseTransformator: (duplication, idx) => _.isEmpty(duplication) && entries[idx].save()
    }))
    .then(savedEntries => _.compact(savedEntries));
  }

});
