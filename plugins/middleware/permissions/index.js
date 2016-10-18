/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewarePermissions', (logger) => {

  return {
    create
  };

  function create(permission) {
    if (permission !== 'FREE' &&
        permission !== 'USER' &&
        permission !== 'ADMIN') {
      logger.error(`unsupported permission (${permission})`);
    }
    return (req, res, next) => {
      if (permission === 'FREE') {
        return next();
      }

      logger.error('not implemented yet');
    };
  }

});
