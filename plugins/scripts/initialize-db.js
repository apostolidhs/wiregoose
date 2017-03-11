/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'scriptsInitializeDb', (
  _,
  q,
  krkPromiseExtension,
  krkLogger,
  krkGeneratorsCreateUser,
  krkDbMongooseConnector,
  krkDbMongooseBinders,
  krkModelsUser,
  config,
  modelsCategory,
  modelsRssProvider,
  modelsRssRegistration,
  modelsApp
) => {

  let providersByName;

  krkPromiseExtension.extend(q);

  krkDbMongooseConnector.connect(config.MONGODB_URL)
    .then(() => krkDbMongooseConnector.dropDatabase())
    .then(() => krkLogger.info('categories imported'))
    .then(() => importSimpleData('providers.json', modelsRssProvider, (data) => ({
      name: data.name,
      link: data.link
    })))
    .then((newProviders) => providersByName = _.keyBy(newProviders, 'name'))
    .then(() => krkLogger.info('providers imported'))
    .then(() => importSimpleData('rss-feed-registrations.json', modelsRssRegistration, (data) => ({
      category: data.category,
      link: data.link,
      lang: data.lang,
      provider: providersByName[data.provider]._id
    })))
    .then(() => krkLogger.info('rssFeedRegistrations imported'))
    .then(() => createAppInfo())
    .then(() => krkLogger.info('appInfo created'))
    .then(() => krkGeneratorsCreateUser.admin({
      name: config.ADMIN_NAME,
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD
    }))
    .then(() => krkLogger.info('admin created'))
    .then(() => process.exit(0))
    .catch((reason) => {
      krkLogger.error('script failed', reason);
      process.exit(1);
    })

  function importSimpleData(filepath, model, getterFunc) {
    const simpleData = require(`../../rss-feed-sources/${filepath}`);

    const promiseOfData = _.map(
      simpleData,
      data => krkDbMongooseBinders.create(model, getterFunc(data))
    );

    return q.all(promiseOfData);
  }

  function createAppInfo() {
    const appInfo = {
      lastRssRegistrationFetch: new Date(0)
    };

    return krkDbMongooseBinders.create(modelsApp, appInfo);
  }

});


