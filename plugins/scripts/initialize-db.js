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

  let categories;
  let providers;

  dbMongooseConnector.connect()
    .then(() => dbMongooseConnector.dropDatabase())
    .then(() => importSimpleData('categories.json', modelsCategory, (data) => ({
      name: data
    })))
    .then((newCategories) => categories = newCategories)
    .then(() => logger.info('categories imported'))
    .then(() => importSimpleData('providers.json', modelsRssProvider, (data) => ({
      name: data.name,
      link: data.link
    })))
    .then((newProviders) => providers = newProviders)
    .then(() => logger.info('providers imported'))
    .then(() => importRssFeedRegistrations())
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

  function importRssFeedRegistrations() {
    const categoriesByName = $_.keyBy(categories, 'name');
    const providersByName = $_.keyBy(providers, 'name');

    const rssFeedRegistrationsData = require('../../rss-feed-sources/rss-feed-registrations.json');

    const promiseOfCategories = $_.map(
      rssFeedRegistrationsData,
      rssFeedRegistrationData => dbMongooseBinders.create(modelsRssRegistration, {
        category: categoriesByName[rssFeedRegistrationData.category]._id,
        link: rssFeedRegistrationData.link,
        lang: rssFeedRegistrationData.lang,
        provider: providersByName[rssFeedRegistrationData.provider]._id
      }
    ));

    return $q.all(promiseOfCategories);
  }

});


