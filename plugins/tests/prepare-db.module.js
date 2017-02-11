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
    connectWithUser,
    connectWithAdmin,
    connect
  };

  function connect(dropDb) {
    return krkDbMongooseConnector.connect(config.MONGODB_URL)
      .then(() => dropDb && krkDbMongooseConnector.dropDatabase())
      .then(() => ensureIndexes());
  }

  function connectWithUser(dropDb, user) {
    return connect(dropDb)
      .then(() => krkGeneratorsLogin.login(user))
      .then((token) => ({token, user}))
      .catch(reason => krkLogger.error(reason));
  }

  function connectWithAdmin(dropDb) {
    let user;
    return connect(dropDb)
      .then(() => krkGeneratorsCreateUser.admin({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password:  config.ADMIN_PASSWORD
      }))
      .then(_user => {
        user = _user;
        return krkGeneratorsLogin.login(_user);
      })
      .then((token) => ({token, user}))
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