/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewarePermissions', (logger) => {

  return {
    check
  };

  function check(permission) {
    if (permission !== 'FREE' &&
        permission !== 'USER' &&
        permission !== 'ADMIN') {
      logger.error(`unsupported permission (${permission})`);
    }
    return (req, res, next) => {
      // permitions are free until phase 4 (user roles, access tokens)
      return next();
    };
  }

});
