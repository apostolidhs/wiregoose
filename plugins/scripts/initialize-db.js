/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'scriptsInitializeDb', (
  $_,
  $q,
  logger,
  dbMongooseConnector,
  dbMongooseBinders,
  modelsCategory,
  modelsRssProvider,
  modelsRssRegistration
) => {

  let categoriesByName;
  let providersByName;

  dbMongooseConnector.connect()
    .then(() => dbMongooseConnector.dropDatabase())
    .then(() => importSimpleData('categories.json', modelsCategory, (data) => ({
      name: data
    })))
    .then((newCategories) => categoriesByName = $_.keyBy(newCategories, 'name'))
    .then(() => logger.info('categories imported'))
    .then(() => importSimpleData('providers.json', modelsRssProvider, (data) => ({
      name: data.name,
      link: data.link
    })))
    .then((newProviders) => providersByName = $_.keyBy(newProviders, 'name'))
    .then(() => logger.info('providers imported'))
    .then(() => importSimpleData('rss-feed-registrations.json', modelsRssRegistration, (data) => ({
      category: categoriesByName[data.category]._id,
      link: data.link,
      lang: data.lang,
      provider: providersByName[data.provider]._id
    })))    
    .then(() => logger.info('rssFeedRegistrations imported'))
    .then(() => process.exit(0))
    .catch((reason) => {
      logger.error('script failed', reason);
      process.exit(1);
    })

  function importSimpleData(filepath, model, getterFunc) {
    const simpleData = require(`../../rss-feed-sources/${filepath}`);

    const promiseOfData = $_.map(
      simpleData,
      data => dbMongooseBinders.create(model, getterFunc(data))
    );

    return $q.all(promiseOfData);
  }

});


