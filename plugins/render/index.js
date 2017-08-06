/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'render', (
  _,
  config,
  $phantom
) => {

  return {
    preRender,
    createMiddlewarePreRender
  };

  function createMiddlewarePreRender(indexPagePath) {
    return (req, res, next) => {
      const url = config.APP_URL + req.url;
      console.log('express request received: ', req.device.type);
      if (req.device.type !== 'phone') {
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
          console.info('phantom js crash', reason);
          res.sendFile(indexPagePath);
        });
    };
  }

  function preRender(url) {
    let page;
    let phantom;
    return createPhantomInstance()
      .then(phantomInstance => phantom = phantomInstance)
      .then(() => createPage(phantom))
      .then(pageInstance => page = pageInstance)
      .then(() => getPageContent(phantom, page, url))
      .catch(reason => {
        releaseResources(phantom, page);
        throw reason;
      });
  }

  function createPhantomInstance() {
    return $phantom.create();
  }

  function createPage(phantom) {
    return phantom.createPage();
  }

  function loadUrl(page, url) {
    return page.open(url);
  }

  function getPageContent(phantom, page, url) {

    page.on('onCallback', function(data) {
      console.log('CALLBACK: ' + JSON.stringify(data));
    });
    // page.on('onError', function() {
    //     console.log("page.onError", arguments);
    // });
    page.on('onConsoleMessage', function() {
        console.log("page.onConsoleMessage", arguments);
    });

    return loadUrl(page, url)
      .then(status => {
        if (status !== 'success') {
          throw new Error(status);
        }
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('get done');
                page.evaluate(function () {
                    return document.readyState;
                })
                  .then(a => console.log('readyState', a));

            // page.property('content').then(resolve).then(() => releaseResources(phantom, page));
          }, 3000);
        });
      });
  }

  function releaseResources(phantom, page) {
    if (page) {
      page.close()
        .then(() => phantom.exit());
    } else if (phantom) {
      phantom.exit()
    }
  }

});
