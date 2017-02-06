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

  let categoriesByName;
  let providersByName;

  krkPromiseExtension.extend(q);

  krkDbMongooseConnector.connect()
    .then(() => krkDbMongooseConnector.dropDatabase())
    .then(() => importSimpleData('categories.json', modelsCategory, (data) => ({
      name: data
    })))
    .then((newCategories) => categoriesByName = _.keyBy(newCategories, 'name'))
    .then(() => krkLogger.info('categories imported'))
    .then(() => importSimpleData('providers.json', modelsRssProvider, (data) => ({
      name: data.name,
      link: data.link
    })))
    .then((newProviders) => providersByName = _.keyBy(newProviders, 'name'))
    .then(() => krkLogger.info('providers imported'))
    .then(() => importSimpleData('rss-feed-registrations.json', modelsRssRegistration, (data) => ({
      category: categoriesByName[data.category]._id,
      link: data.link,
      lang: data.lang,
      provider: providersByName[data.provider]._id
    })))
    .then(() => krkLogger.info('rssFeedRegistrations imported'))
    .then(() => createAppInfo())
    .then(() => krkLogger.info('appInfo created'))
    .then(() => krkGeneratorsCreateUser.admin())
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


