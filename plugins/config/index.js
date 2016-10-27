/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'config', (logger) => {
  const config = require('../../config.js');
  if (!config) {
    process.exit(1);
    throw new Error('config.js in missing from the root folder');
  }

  const credentials = config.MONGODB_USER ? `${config.MONGODB_USER}:${config.MONGODB_PASS}@` : '';
  const dbName = process.env.UNIT_TEST ? config.MONGODB_MOCK_DATABASE_NAME : config.MONGODB_DATABASE_NAME;
  config.MONGODB_URL = `mongodb://${credentials}${config.MONGODB_DOMAIN}/${dbName}`;

  config.ENABLE_RSS_REGISTRATIONS_FETCH = process.env.UNIT_TEST ? false : config.ENABLE_RSS_REGISTRATIONS_FETCH; 

  return config;
});
