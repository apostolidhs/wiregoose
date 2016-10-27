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
  config,
  promiseExtension,
  router,
  dbMongooseConnector,
  middlewareInitiateResponseParams,
  middlewareResponse,
  rssRegistrationsFetcher,
  routesRssFeedFetchRssFeed,
  routesRssFeedFetchRssRegistrations,
  routesCrud
) => {

  return {
    create
  };

  function create() {
    promiseExtension.extend($q);
    dbMongooseConnector.connect();

    return createApp();
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
    startPeriodicalProcesses();

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

  function startPeriodicalProcesses() {
    if (config.ENABLE_RSS_REGISTRATIONS_FETCH) {
      rssRegistrationsFetcher.startPeriodicalFetchProcess(); 
    }    
  }

});
