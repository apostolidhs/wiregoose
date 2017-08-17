/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'render', (
  q,
  _,
  $phantom,
  krkLogger,
  krkDbMongooseBinders,
  config,
  modelsPreRender
) => {

  const debug = true;
  const PRE_RENDER_TIMEOUT = 8000; //ms
  const PRE_RENDER_ENABLED_DEVICES = ['bot', 'car'];

  let phantomInstancePrms = $phantom.create();

  return {
    preRender,
    createMiddlewareCachedPreRender
  };

  function createMiddlewareCachedPreRender(indexPagePath) {
    return (req, res, next) => {
      if (!_.includes(PRE_RENDER_ENABLED_DEVICES, req.device.type)) {
        return res.sendFile(indexPagePath);
      }
      return retrievePreRenderPageAndUpdateHitCounter(req.url)
        .then(preRenderEntry => {
          if (preRenderEntry) {
            return responseContent(res, preRenderEntry.content);
          }

          const url = config.APP_URL + req.url;
          return preRender(url)
            .catch((reason) => {
              krkLogger.info('phantom js crash', reason);
              res.sendFile(indexPagePath);
            })
            .then(content => {
              if (content) {
                return savePreRenderContent(content, req.url)
                  .then(preRenderEntry => responseContent(res, preRenderEntry.content));
              }
            });
        })
        .catch(reason => {
          res.locals.errors.add('UNEXPECTED', reason);
          next(true);
        });
    };
  }

  function preRender(url) {
    let page;
    let phantom;
    return phantomInstancePrms
      .then(phantomInstance => phantom = phantomInstance)
      .then(() => phantom.createPage())
      .then(pageInstance => page = pageInstance)
      .then(() => getPageContent(phantom, page, url))
      .then(content => {
        page.close();
        return content;
      })
      .catch(reason => {
        page.close();
        throw reason;
      });
  }

  function getPageContent(phantom, page, url) {
    let isLoadingPage = true;

    return new Promise((resolve, reject) => {
      page.on('onCallback', function(data) {
        if (debug) {
          krkLogger.log('CALLBACK: ' + JSON.stringify(data));
        }

        page.evaluate(function() {
          var scripts = document.getElementsByTagName("script");
          while(scripts.length) {
            scripts[0].parentElement.removeChild(scripts[0]);
          }
        })
        .then(() => page.property('content'))
        .then(content => resolveLoaded(content))
        .catch(rejectLoaded);
      });

      if (debug) {
        page.on('onConsoleMessage', function() {
          krkLogger.log("page.onConsoleMessage", arguments);
        });
      }

      // abort external requests
      page.on('onResourceRequested', true, function(requestData, networkRequest, appUrl) {
        if (requestData.url.match(appUrl) === null) {
          networkRequest.abort();
        }
      }, config.APP_URL);

      page.open(url)
        .then(status => {
          if (status !== 'success') {
            return rejectLoaded(status);
          }
        })
        .catch(rejectLoaded);

      setTimeout(() => rejectLoaded('timeout'), PRE_RENDER_TIMEOUT);

      function rejectLoaded(reason) {
        if (isLoadingPage) {
          isLoadingPage = false;
          reject(reason);
        }
      }

      function resolveLoaded(value) {
        if (isLoadingPage) {
          isLoadingPage = false;
          resolve(value);
        }
      }
    });
  }

  function savePreRenderContent(content, link) {
    const preRenderEntry = {
      content,
      link,
      createdAt: new Date(),
      lastHit: new Date(),
      hits: 0
    };
    return krkDbMongooseBinders
      .create(modelsPreRender, preRenderEntry);
  }

  function retrievePreRenderPageAndUpdateHitCounter(link) {
    const q = {
      $inc: { hits: 1 },
      lastHit: new Date()
    };
    return krkDbMongooseBinders.findOneAndUpdate(modelsPreRender, { link }, q);
  }

  function responseContent(res, content) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8'
    });
    res.end(content);
  }

});
