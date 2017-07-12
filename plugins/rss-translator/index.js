/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'rssTranslator', (
  q,
  _,
  $isUrl,
  $cheerio,
  modelsEntry,
  rssTranslatorFetchAndParse
) => {

  return {
    translateFromUrl,
    translateFromFile
  };

  function translateFromFile(filepath, providerName) {
    return rssTranslatorFetchAndParse.fromFile(filepath)
      .then(items => translateItems(items, providerName));
  }

  function translateFromUrl(url, rssRegistration) {
    return rssTranslatorFetchAndParse.fromUrl(url)
      .then(items => translateItems(items, rssRegistration));
  }

  function translateItems(items, rssRegistration) {
    const entries = [];
    const errors = [];
    _.each(items, item => translateItem(item, rssRegistration, (error, entry) => {
      if (error) {
        errors.push(error);
      } else {
        entries.push(entry);
      }
    }));

    return {entries, errors};
  }

  // critical speed part, avoid using promises
  function translateItem(rawItem, rssRegistration, done) {
    if (!_.isObject(rawItem)) {
      return;
    }

    const item = filterItemFields(rawItem);
    item.author = item.author || _.get(rawItem, "['atom:author']['name']['#']");

    const title = sanitizeString(item.title, 'title');

    let description = sanitizeString(item.summary, 'description')
                      || sanitizeString(item.description, 'description');

    if (!description && item.summary) {
      const JQSummary = $cheerio.load(item.summary);
      description = JQSummary('img').attr('title')
                      || JQSummary('img').attr('alt');
    }

    if (!description && item.description) {
      const JQDescription = $cheerio.load(item.description);
      description = JQDescription('img').attr('title')
                      || JQDescription('img').attr('alt');
    }

    let image = sanitizeUrl(getImage(item));
    if (!image && item.summary) {
      image = sanitizeUrl($cheerio.load(item.summary)('img').attr('src'));
    }
    if (!image && item.description) {
      image = sanitizeUrl($cheerio.load(item.description)('img').attr('src'));
    }

    const published = sanitizeDate(item.pubdate);
    const link = sanitizeUrl(item.link);
    const author = sanitizeString(item.author, 'author');
    const provider = rssRegistration.provider.name;

    const data = {
      title,
      image,
      description,
      published,
      link,
      provider,
      author,
      registration: rssRegistration._id
    };

    const entry = new modelsEntry(data);

    const error = entry.validateSync();
    if (_.isEmpty(error)) {
      return done(undefined, data);
    }

    const errorReport = {
      item,
      reason: summaryValidationError(error)
    };
    return done(errorReport);

  }

  function summaryValidationError(error) {
    if (error.message && !_.isEmpty(error.errors)) {
      return {
        msg: error.message,
        fields: _.keys(error.errors)
      };
    }
    return error;
  }

  function getImage(item) {
    let img;
    if (_.isObject(item.image)) {
      img = item.image.url || item.image.link;
    }
    if (img) {
      return img;
    }
    if (_.isArray(item.enclosures)) {
      const imgEnclosure = _.find(
        item.enclosures,
        enclosure => enclosure && _.startsWith(enclosure.type, 'image/')
      );
      if (imgEnclosure) {
        return imgEnclosure.url;
      }
    }
  }

  function sanitizeString(str, path) {
    const validators = modelsEntry.schema.path(path).validators;
    const maxLengthValidator = _.find(validators, {type: 'maxlength'});
    if (_.isString(str) && str) {
      let escapedStr = $cheerio.load(str).text() || '';
      escapedStr = _.trim(escapedStr.replace(/(\r\n|\n|\r)/gm, ''));
      return escapedStr ? escapedStr.substr(0, maxLengthValidator.maxlength) : undefined;
    }
  }

  function sanitizeUrl(img) {
    if (_.isString(img)) {
      img = img.trim().replace(/ /g, '%20');
      return $isUrl(img) ? img : undefined;
    }
  }

  function sanitizeDate(published) {
    if (!_.isDate(published)) {
      return;
    }

    return _.isNaN(published.getTime()) ? undefined : published;
  }

  function filterItemFields(item) {
    return _.pick(item, [
      'title',
      'summary',
      'description',
      'pubdate',
      'link',
      'author',
      'enclosures',
      'image'
    ]);
  }

});
