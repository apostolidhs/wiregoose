/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMiningExtractContent', (
  $readabilityNode,
  $jsdom,
  $http
) => {

  const FAILURE_REASONS = {
    CANNOT_REACH_URL: 1,
    CANNOT_PARSE_CONTENT: 2
  };

  return {
    extract,
    FAILURE_REASONS
  };

  function extract(uri) {
    return new Promise((resolve, reject) => {
      $http.get(uri, (res) => {
        const srcChunks = [];
        let errorOccurred = false;

        res.on('data', d => srcChunks.push(d));
        res.on('error', (reason) => {
          errorOccurred = true;
          reject({
            code: FAILURE_REASONS.CANNOT_REACH_URL,
            msg: reason
          });
        });
        res.on('end', () => {
          if (errorOccurred) {
            return;
          }
          const src = srcChunks.join('');
          try {
            const doc = $jsdom.jsdom(src, {
              features: {
                FetchExternalResources: false,
                ProcessExternalResources: false
              }
            });
            const article = new $readabilityNode.Readability(uri, doc).parse();
            resolve(article);
          } catch (e) {
            reject({
              code: FAILURE_REASONS.CANNOT_PARSE_CONTENT,
              msg: e
            });
          }
        });
      });
    });
  }

});
