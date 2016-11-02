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
  $passport,
  config,
  promiseExtension,
  middlewareAuthorizeStrategy,
  router,
  dbMongooseConnector,
  middlewareInitiateResponseParams,
  middlewareResponse,
  rssRegistrationsFetcher,
  routesRssFeedFetchRssFeed,
  routesRssFeedFetchRssRegistrations,
  routesCrud,
  routesAuthorize
) => {

  return {
    create
  };

  function create() {
    promiseExtension.extend($q);
    dbMongooseConnector.connect();
    middlewareAuthorizeStrategy.register($passport);

    return createApp();
  }

  function createApp() {
    const app = $express();    

    app.use(allowCrossDomain);
    app.use(middlewareInitiateResponseParams);

    app.use($morgan('dev'));
    app.use($bodyParser.json());
    app.use($bodyParser.urlencoded({ extended: false }));
    app.use($expressValidator());
    app.use($cookieParser());
    app.use($express.static($path.join(__dirname, '../../', 'public')));    

    registerRoutes(app);
    startPeriodicalProcesses();

    app.use(router);

    app.use(middlewareResponse.fail);

    return app;
  }

  function allowCrossDomain(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

      next();
  }  

  function registerRoutes(app) {
    $_.each([
      routesRssFeedFetchRssRegistrations,
      routesRssFeedFetchRssFeed,
      routesCrud,
      routesAuthorize
    ], route => route.register(app));
  }

  function startPeriodicalProcesses() {
    if (config.ENABLE_RSS_REGISTRATIONS_FETCH) {
      rssRegistrationsFetcher.startPeriodicalFetchProcess(); 
    }    
  }

});
