/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'testsPrepareDb', (krkDbMongooseConnector, krkGeneratorsCreateUser, krkGeneratorsLogin, krkLogger) => {

  return {
    prepare
  };

  function prepare() {
    return krkDbMongooseConnector.connect($$config.MONGODB_URL)
      .then(() => krkDbMongooseConnector.dropDatabase())
      .then(() => krkGeneratorsCreateUser.admin())
      .then(user => krkGeneratorsLogin.login(user))
      .then((token) => ({token}))
      .catch(reason => krkLogger(reason));
  }

});