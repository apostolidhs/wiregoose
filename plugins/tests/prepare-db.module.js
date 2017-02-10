/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'testsPrepareDb', (
  _,
  q,
  $mongoose,
  krkDbMongooseConnector,
  krkGeneratorsCreateUser,
  krkGeneratorsLogin,
  config,
  krkLogger
) => {

  return {
    connectWithAdmin,
    connect
  };

  function connect() {
    return krkDbMongooseConnector.connect(config.MONGODB_URL)
      .then(() => krkDbMongooseConnector.dropDatabase())
      .then(() => ensureIndexes());
  }

  function connectWithAdmin() {
    return connect()
      .then(() => krkGeneratorsCreateUser.admin({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password:  config.ADMIN_PASSWORD
      }))
      .then(user => krkGeneratorsLogin.login(user))
      .then((token) => ({token}))
      .catch(reason => krkLogger.error(reason));
  }

  function ensureIndexes() {
    const modelSchemas = $mongoose.connections[0].base.modelSchemas;
    const models = _.keys(modelSchemas);
    const rebuildIndexesPrms = _.map(
      models,
      model => $mongoose.model(model, modelSchemas[model]).ensureIndexes()
    );
    return q.all(rebuildIndexesPrms);
  }
});