/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'render', (
  q,
  _,
  config,
  krkLogger,
  $phantom
) => {

  const debug = true;
  const PRE_RENDER_TIMEOUT = 8000; //ms
  const PRE_RENDER_ENABLED_DEVICES = ['bot', 'car', 'phone'];

  let phantomInstancePrms = $phantom.create();

  return {
    preRender,
    createMiddlewarePreRender
  };

  /*
    save content on mongo (cache)
  */

  function createMiddlewarePreRender(indexPagePath) {
    return (req, res, next) => {
      const url = config.APP_URL + req.url;
      if (!_.includes(PRE_RENDER_ENABLED_DEVICES, req.device.type)) {
        return res.sendFile(indexPagePath);
      }
      preRender(url)
        .then(content => {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8'
          });
          res.end(content);
        })
        .catch((reason) => {
          krkLogger.info('phantom js crash', reason);
          res.sendFile(indexPagePath);
        });
    };
  }

  function preRender(url) {
    let page;
    let phantom;
    return phantomInstancePrms
      .then(phantomInstance => phantom = phantomInstance)
      .then(() => createPage(phantom))
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

  function createPage(phantom) {
    return phantom.createPage();
  }

  function loadUrl(page, url) {
    return page.open(url);
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

      loadUrl(page, url)
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

});
