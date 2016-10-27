/* jshint esversion: 6 */

const config = {};

config.RUN_MODE = ''; // dev | dist

config.NAME = 'Wiregoose'; // 'applicationName'

config.PORT = 3000; // application port

config.API_VERSION = ''; // 'v1';
config.API_URL_PREFIX = ''; // `api/${config.API_VERSION}`;

config.ENABLE_RSS_REGISTRATIONS_FETCH = true;
config.RSS_REGISTRATIONS_FETCH_FREQUENT = 4 * 60 * 60 * 1000; // how often it will fetch the registrations

config.MONGODB_PASS = ''; // 'MongoDB password, undefined if not credentials';
config.MONGODB_USER = ''; // 'MongoDB username, undefined if not credentials';
config.MONGODB_DOMAIN = ''; // 'MongoDB domain';
config.MONGODB_DATABASE_NAME = ''; // 'MongoDB database name';
config.MONGODB_MOCK_DATABASE_NAME = ''; // 'MongoDB mock database name, for unit tests';

config.SUPPORTED_LANGUAGES = [
  'en',
  'gr'
];

module.exports = config;
