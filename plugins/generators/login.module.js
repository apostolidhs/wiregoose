/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'generatorsLogin', (middlewarePermissions, modelsUser) => {

  return {
    login
  };

  function login(user) {
    return middlewarePermissions.createJWT(user);
  }

});