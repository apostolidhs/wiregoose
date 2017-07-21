/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMining', (
  _,
  $readabilityNode,
  $jsdom,
  $http,
  krkDbMongooseBinders,
  modelsEntry,
  modelsArticle
) => {

  return {
    cachedExtraction
  };

  function cachedExtraction(entryId) {
    return retrieveEntry(entryId)
      .then(entry => {
        const link = entry.link;
        return retrieveArticleAndUpdateCacheHit(link)
          .then(article => {
            if (!_.isEmpty(article)) {
              return article;
            }

            return articleMiningExtractContent.extract(link)
              .then(doc => createSuccessfullyArticle(doc, entry))
              .then(reason => createFailedArticle(reason, entry));
          });
      });
  }

  function retrieveEntry(entryId) {
    return krkDbMongooseBinders.findById(modelsEntry, entryId);
  }

  function retrieveArticleAndUpdateCacheHit(articleId) {
    const q = {
      $inc: { hits: 1 },
      lastHit: new Date()
    };
    return krkDbMongooseBinders
      .findByIdAndUpdate(modelsArticle, articleId, q);
  }

  function createSuccessfullyArticle(doc, entry) {
    const article = _.assignIn({
      content: doc.content,
      contentLength: doc.length || 0,
      title: doc.title,
      byline: dic.byline,
      error: undefined
    }, createBasicArticle(entry));

    return krkDbMongooseBinders
      .create(modelsArticle, article);
  }

  function createFailedArticle(reason, entry) {
    const article = _.assignIn({
      error: {
        code: reason.code,
        msd: reason.msg
      }
    }, createBasicArticle(entry));

    return krkDbMongooseBinders
      .create(modelsArticle, article);
  }

  function createBasicArticle(entry) {
    return {
      link: entry.link,
      entryId: entry._id,
      createdAt: new Date(),
      lastHit: new Date(),
      hits: 0
    };
  }

});
