KlarkModule(module, 'scriptsInitializeDb', (
  _,
  q,
  config,
  krkLogger,
  krkDbMongooseConnector,
  krkPromiseExtension,
  $mongoose
) => {
  krkPromiseExtension.extend(q);

  krkLogger.info('start');
  krkDbMongooseConnector.connect(config.MONGODB_URL)
    .then(() => q.all(_.map($mongoose.models, model =>
        q.promisify(cb => model.collection.dropAllIndexes(cb)))))
    .then(() => krkLogger.info('finish'))
    .catch(reason => {
      krkLogger.error('script failed', reason);
      process.exit(1);
    })
});
