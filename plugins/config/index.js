/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'config', (logger) => {
  const config = require('../../config.js');
  if (!config) {
    process.exit(1);
    throw new Error('config.js in missing from the root folder');
  }

  const credentials = config.MONGODB_USER ? `${config.MONGODB_USER}:${config.MONGODB_PASS}@` : '';
  config.MONGODB_URL = `mongodb://${credentials}${config.MONGODB_DOMAIN}/${config.MONGODB_DATABASE_NAME}`;

  return config;
});
