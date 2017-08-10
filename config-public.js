/* jshint esversion: 6 */

const config = {};

config.RUN_MODE = 'dev'; // dev | dist

config.IS_DEV = config.RUN_MODE === 'dev';

config.NAME = 'Wiregoose'; // 'applicationName'

config.PORT = 3000; // application port

config.APP_URL = 'http://localhost:3000'; // localhost:3000

config.API_VERSION = 'v1'; // 'v1';
config.API_URL_PREFIX = 'api/v1'; // `api/${config.API_VERSION}`;

config.API_URL = config.IS_DEV ? 'http://localhost:3000' : '';

config.FACEBOOK_APP_ID = '821271344594009';

config.SUPPORTED_LANGUAGES = [
  'en',
  'gr'
];

config.CATEGORIES = [
  'Country',
  'World',
  'Politics',
  'Economy',
  'Society',
  'Environment',
  'Technology',
  'Travel',
  'Food',
  'Entertainment',
  'Sports',
  'Auto',
  'Lifestyle',
  'Culture',
  'Health',
  'Viral',
  'Media'
];

module.exports = config;
