/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'dbMongooseConnector', ($q, $mongoose, logger, config) => {

  let promiseOfConnection;
  decorateMongoosePromises();

  return {
    connect,
    dropDatabase
  };

  function decorateMongoosePromises() {
    $mongoose.Promise = $q.Promise;
  }

  function connect() {
    if (promiseOfConnection) {
      return promiseOfConnection;
    }

    const deffered = $q.defer();

    $mongoose.connect(config.MONGODB_URL);
    const db = $mongoose.connection;
    db.on('error', (err) => {
      logger.error('Connection error:', err);
      deffered.reject(err);
    });
    db.once('open', () => {
      logger.info('Connected to mongo');
      deffered.resolve();
    });

    promiseOfConnection = deffered.promise;
    return promiseOfConnection;
  }

  function dropDatabase() {
    return $mongoose.connection.db.dropDatabase();
  }

});
