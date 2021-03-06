/* jshint esversion: 6 */

const config = Object.assign({}, require('./config-public.js'));

config.ENABLE_RSS_REGISTRATIONS_FETCH = true;
config.RSS_REGISTRATIONS_FETCH_FREQUENT = 4 * 60 * 60 * 1000; // ms, how often it will fetch the registrations

config.MONGODB_PASS = ''; // 'MongoDB password, undefined if not credentials';
config.MONGODB_USER = ''; // 'MongoDB username, undefined if not credentials';
config.MONGODB_DOMAIN = ''; // 'MongoDB domain';
config.MONGODB_DATABASE_NAME = ''; // 'MongoDB database name';
config.MONGODB_MOCK_DATABASE_NAME = ''; // 'MongoDB mock database name, for unit tests';

config.USER_ACCOUNT_VALIDATION_PERIOD = 10; // seconds, after signup of the account, how long will the user remain until it will be validated

config.JWT_SECRET = ''; // secret key for jwt encode
config.JWT_EXPIRATION_PERIOD = 4 * 24 * 60 * 60 * 1000; // ms, jwt expiration period

config.FACEBOOK_APP_SECRET = '';

config.ADMIN_NAME = ''; // initial admin name
config.ADMIN_EMAIL = ''; // initial admin email address
config.ADMIN_PASSWORD = ''; // initial admin password

config.EMAIL_NAME = ''; // user (optionally)
config.EMAIL_ADDRESS = ''; // user%40gmail.com
config.EMAIL_SMTP = ''; // smtps://user%40gmail.com:pass@smtp.gmail.com

config.ARTICLE_MINING_EXPIRATION = 20 * 24 * 60 * 60; // s, when the cached article will expired
// config.ARTICLE_MINING_CACHE_SIZE = 5000; // how much articles will be stored

config.PRE_RENDER_EXPIRATION = 4 * 24 * 60 * 60; // s, when the cached article will expired

module.exports = config;
