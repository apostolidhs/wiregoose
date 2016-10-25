/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'app', (
  $_,
  $q,
  $express,
  $path,
  $serveFavicon,
  $expressValidator,
  $bodyParser,
  $cookieParser,
  $morgan,
  $mongoose,
  promiseExtension,
  router,
  dbMongooseConnector,
  middlewareInitiateResponseParams,
  middlewareResponse,
  routesRssFeedFetchRssFeed,
  routesRssFeedFetchRssRegistrations,
  routesCrud
) => {

  init();

  return createApp();

  function init() {
    promiseExtension.extend($q);
    dbMongooseConnector.connect();
  }

  function createApp() {
    const app = $express();

    app.use(middlewareInitiateResponseParams);

    app.use($morgan('dev'));
    app.use($bodyParser.json());
    app.use($bodyParser.urlencoded({ extended: false }));
    app.use($expressValidator());
    app.use($cookieParser());
    app.use($express.static($path.join(__dirname, 'public')));

    registerRoutes(app);

    app.use(router);

    app.use(middlewareResponse.fail);

    return app;
  }

  function registerRoutes(app) {
    $_.each([
      routesRssFeedFetchRssRegistrations,
      routesRssFeedFetchRssFeed,
      routesCrud
    ], route => route.register(app));
  }

});
