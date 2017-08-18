/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'articleMiningExtractContent', (
  $readabilityNode,
  $jsdom,
  $request,
  $url,
  articleMiningCustomExtractors
) => {

  const FAILURE_REASONS = {
    CANNOT_REACH_URL: 1,
    CANNOT_PARSE_CONTENT: 2
  };

  return {
    extract,
    FAILURE_REASONS
  };

  function extract(link, provider) {
    const decodedLink = decodeURIComponent(link);
    return redirectedExtraction(decodedLink, provider, 0);
  }

  function redirectedExtraction(link, provider, totalRedirects) {
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
              const article = makeContentReadable(link, page.content, provider)
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
            redirectedExtraction(location, provider, ++totalRedirects)
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
      $request(link, function(error, res, content) {
        if (error) {
          return reject(error);
        }
        resolve({ content, res });
      });
    });
  }

  function makeContentReadable(link, content, provider) {
    const doc = $jsdom.jsdom(content, {
      features: {
        FetchExternalResources: false,
        ProcessExternalResources: false
      }
    });

    articleMiningCustomExtractors.extract(provider, doc);

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
