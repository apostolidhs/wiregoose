/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'testsPrepareDb', (dbMongooseConnector, generatorsCreateUser, generatorsLogin, logger) => {

  return {
    prepare
  };

  function prepare() {
    return dbMongooseConnector.connect()
      .then(() => dbMongooseConnector.dropDatabase())
      .then(() => generatorsCreateUser.admin())
      .then(user => generatorsLogin.login(user))
      .then((token) => ({token}))
      .catch(reason => logger(reason));
  }

});