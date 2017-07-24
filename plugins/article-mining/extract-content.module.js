/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMiningExtractContent', (
  $readabilityNode,
  $jsdom,
  $http,
  $url
) => {

  const FAILURE_REASONS = {
    CANNOT_REACH_URL: 1,
    CANNOT_PARSE_CONTENT: 2
  };

  return {
    extract,
    FAILURE_REASONS
  };

  function extract(link) {
    return redirectedExtraction(link, 0);
  }

  function redirectedExtraction(link, totalRedirects) {
    return new Promise((resolve, reject) => {
      if (totalRedirects > 2) {
        return reject({
          code: FAILURE_REASONS.CANNOT_REACH_URL,
          msg: 'To many redirections'
        });
      }
      getPageResponse(link)
        .then((page) => {
          if (page.res.statusCode === 200) {
            try {
              const article = makeContentReadable(link, page.content, page.res)
              resolve(article);
            } catch (e) {
              reject({
                code: FAILURE_REASONS.CANNOT_PARSE_CONTENT,
                msg: e
              });
            }
          } else if (page.res.statusCode === 301) {
            redirectedExtraction(page.res.headers.location, ++totalRedirects)
              .then(resolve)
              .catch(reject);
          } else {
            reject({
              code: FAILURE_REASONS.CANNOT_REACH_URL,
              msg: `status code ${page.res.statusCode}, status message ${page.res.statusMessage}`
            });
          }
        })
        .catch((reason) => {
          reject({
            code: FAILURE_REASONS.CANNOT_REACH_URL,
            msg: reason
          });
        });
    });
  }

  function getPageResponse(link) {
    return new Promise((resolve, reject) => {
      const url = $url.parse(link, true);
      const requestOptions = {
        host: url.host,
        path: url.path,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
        }
      };

      $http
        .request(requestOptions, (res) => {
          let errorOccurred = false;
          const responseChunks = [];

          res.on('data', d => responseChunks.push(d + ''));
          res.on('error', (reason) => {
            errorOccurred = true;
            reject(reason, res);
          });
          res.on('end', () => {
            if (!errorOccurred) {
              const content = responseChunks.join('');
              resolve({content, res});
            }
          });
        })
        .end();
    });
  }

  function makeContentReadable(link, content, res) {
    const doc = $jsdom.jsdom(content, {
      features: {
        FetchExternalResources: false,
        ProcessExternalResources: false
      }
    });
    const article = new $readabilityNode.Readability(link, doc).parse();
    if (!article) {
      throw new Error('CANNOT_PARSE_CONTENT');
    }
    return article;
  }

});
