/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'dbMongooseConnector', ($mongoose, logger, config) => {

  return {
    connect,
    dropDatabase
  };

  function connect() {
    $mongoose.connect(config.MONGODB_URL);
    const db = $mongoose.connection;
    db.on('error', (err) => logger.error('Connection error:', err));
    db.once('open', () => logger.info('Connected to mongo'));
  }

  function dropDatabase() {
    return $mongoose.connection.db.dropDatabase();
  }

});
