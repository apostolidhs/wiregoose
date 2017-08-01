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
          const status = page.res.statusCode;
          if (status === 200) {
            try {
              const article = makeContentReadable(link, page.content, page.res)
              resolve(article);
            } catch (e) {
              reject({
                code: FAILURE_REASONS.CANNOT_PARSE_CONTENT,
                msg: e
              });
            }
          } else if (status >= 300 && status < 400 && page.res.headers.location) {
            let location = page.res.headers.location;
            if (location.startsWith('/')) {
              const linkUrl = $url.parse(link);
              linkUrl.path = location;
              linkUrl.pathname = location;
              location = $url.format(linkUrl);
            }
            redirectedExtraction(location, ++totalRedirects)
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

      let errorOccurred = false;
      const req = $http.request(requestOptions, (res) => {
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
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
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
    if (article.content) {
      const readableDoc = $jsdom.jsdom(article.content, {
        features: {
          FetchExternalResources: false,
          ProcessExternalResources: false
        }
      });
      readableDoc.querySelectorAll('.page *').forEach((node) => {
        node.removeAttribute('class');
        node.removeAttribute('style');
        node.removeAttribute('id');
        node.removeAttribute('onClick');
        const tagName = (node.tagName || '').toLowerCase();
        if (tagName === 'a') {
          node.setAttribute('target', '_blank');
        }
      });
      const readableDocHtml = readableDoc.body.innerHTML;
      if (readableDocHtml) {
        article.content = readableDocHtml;
      }
    }
    return article;
  }

});
