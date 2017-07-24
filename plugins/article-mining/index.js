/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMining', (
  _,
  $readabilityNode,
  $jsdom,
  $http,
  krkDbMongooseBinders,
  articleMiningExtractContent,
  modelsEntry,
  modelsArticle
) => {

  return {
    cachedExtraction
  };

  function cachedExtraction(entryId) {
    return retrieveEntryAndUpdateHitCounter(entryId)
      .then(entry => {
        if (_.isEmpty(entry)) {
          return;
        }
        const link = entry.link;
        return retrieveArticle(link)
          .then(article => {
            if (!_.isEmpty(article)) {
              return article;
            }

            return articleMiningExtractContent.extract(link)
              .then(doc => createSuccessfullyArticle(doc, entry))
              .catch(reason => createFailedArticle(reason, entry));
          });
      });
  }

  function retrieveEntryAndUpdateHitCounter(entryId) {
    const q = {
      $inc: { hits: 1 },
      lastHit: new Date()
    };
    return krkDbMongooseBinders
      .findByIdAndUpdate(modelsEntry, entryId, q);
  }

  function retrieveArticle(link) {
    const q = { link };
    return modelsArticle.findOne(q);
  }

  function createSuccessfullyArticle(doc, entry) {
    const article = _.assignIn({
      content: doc.content,
      contentLength: doc.length || 0,
      title: doc.title,
      byline: doc.byline,
      error: undefined
    }, createBasicArticle(entry));

    return saveArticle(article, entry);
  }

  function createFailedArticle(reason, entry) {
    const article = _.assignIn({
      error: {
        code: reason.code,
        msd: reason.msg
      }
    }, createBasicArticle(entry));

    return saveArticle(article, entry);
  }

  function createBasicArticle(entry) {
    return {
      link: entry.link,
      entryId: entry._id,
      createdAt: new Date()
    };
  }

  function saveArticle(article, entry) {
    return krkDbMongooseBinders
      .create(modelsArticle, article)
      .then(article => {
        article.entryId = entry;
        return article;
      });
  }

});
