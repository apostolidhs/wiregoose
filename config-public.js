/* jshint esversion: 6 */

const config = {};

config.RUN_MODE = 'dist'; // dev | dist

config.IS_DEV = config.RUN_MODE === 'dev';

config.NAME = 'Wiregoose'; // 'applicationName'

config.PORT = config.IS_DEV ? 3000 : 4001; // application port

config.APP_URL = config.IS_DEV ? 'http://localhost:3003' : 'http://wiregoose.com'; // localhost:3000

config.API_VERSION = 'v1'; // 'v1';
config.API_URL_PREFIX = 'api/v1'; // `api/${config.API_VERSION}`;

config.API_URL = config.IS_DEV ? 'http://localhost:3000' : 'http://wiregoose.com';

config.SECURE_APP_URL = config.IS_DEV ? 'http://localhost:3003' : 'https://wiregoose.com';

config.MAX_BOOKMARKS_PER_USER = 200;

config.FACEBOOK_APP_ID = config.IS_DEV ? '107998553336713' : '821271344594009';
config.FACEBOOK_PAGE = 'https://www.facebook.com/wiregoose';

config.GOOGLE_TRACKING_ID = 'UA-90338056-2';

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
  'Science',
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
