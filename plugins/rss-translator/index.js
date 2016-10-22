/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'rssTranslator', ($_, $isUrl, $cheerio, modelsEntry, rssTranslatorFetchAndParse) => {
  const HEALTHY_PERCENTAL_THRESSHOLD = 0.75;

  return {
    translateFromUrl,
    translateFromFile
  };

  function translateFromFile(filepath) {
    return rssTranslatorFetchAndParse.fromFile(filepath)
      .then(translateItems);
  }

  function translateFromUrl(url) {
    return rssTranslatorFetchAndParse.fromUrl(url)
      .then(translateItems);
  }

  function translateItems(items) {
    const entries = $_.map(items, translateItem);
    const healthyEntries = $_.compact(entries);

    const healthyPercental = $_.size(healthyEntries) / $_.size(entries);

    return $_.isNumber(healthyPercental) && healthyPercental > HEALTHY_PERCENTAL_THRESSHOLD ? entries : undefined;
  }

  function translateItem(item) {
    if (!$_.isObject(item)) {
      return;
    }
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

    if (!description) {
      return;
    }

    let image = sanitizeUrl(getImage(item));
    if (!image && item.summary) {
      image = sanitizeUrl($cheerio.load(item.summary)('img').attr('src'));
    }
    if (!image && item.description) {
      image = sanitizeUrl($cheerio.load(item.description)('img').attr('src'));
    }

    if (!image) {
      return;
    }

    const published = sanitizeDate(item.pubdate);
    const link = sanitizeUrl(item.link);
    const author = sanitizeString(item.author, 'author');
    const provider = 'bbc';

    const entry = new modelsEntry.model({
      title,
      image,
      description,
      published,
      link,
      provider,
    });

    const errors = entry.validateSync();
    return errors ? undefined : entry;
  }

  function getImage(item) {
    let img;
    if ($_.isObject(item.image)) {
      img = item.image.url || item.image.link;
    }
    if (img) {
      return img;
    }
    if ($_.isArray(item.enclosures)) {
      const imgEnclosure = $_.find(
        item.enclosures,
        enclosure => enclosure && $_.startsWith(enclosure.type, 'image/')
      );
      if (imgEnclosure) {
        return imgEnclosure.url;
      }
    }
  }

  function sanitizeString(str, path) {
    const validators = modelsEntry.model.schema.path(path).validators;
    const maxLengthValidator = $_.find(validators, {type: 'maxlength'});
    if ($_.isString(str) && str) {
      let escapedStr = $cheerio.load(str).text() || '';
      escapedStr = $_.trim(escapedStr.replace(/(\r\n|\n|\r)/gm,""));
      return escapedStr ? escapedStr.substr(0, maxLengthValidator.maxlength) : undefined;
    }
  }

  function sanitizeUrl(img) {
    return $_.isString(img) && $isUrl(img) ? img : undefined;
  }

  function sanitizeDate(published) {
    return $_.isDate(published) ? published : undefined;
  }

});
