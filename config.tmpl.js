/* jshint esversion: 6 */

const config = {};

config.RUN_MODE = ''; // dev | dist

config.NAME = ''; // 'applicationName'

config.PORT = 3000; // application port

config.API_VERSION = ''; // 'v1';
config.API_URL_PREFIX = ''; // `api/${config.API_VERSION}`;

config.MONGODB_PASS = ''; // 'MongoDB password, undefined if not credentials';
config.MONGODB_USER = ''; // 'MongoDB username, undefined if not credentials';
config.MONGODB_DOMAIN = ''; // 'MongoDB domain';
config.MONGODB_DATABASE_NAME = ''; // 'MongoDB database name';

module.exports = config;
