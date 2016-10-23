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
  router,
  dbMongooseConnector,
  middlewareInitiateResponseParams,
  middlewareResponse,
  routesRssFeedFetchRssFeed,
  routesCrud
) => {

  init();

  return createApp();

  function init() {
    extendPromise();
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
      routesRssFeedFetchRssFeed,
      routesCrud
    ], route => route.register(app));
  }

  function extendPromise() {
    $q.promisify = (ctx) => {
      const deferred = $q.defer();
      ctx().exec((err, record) => {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(record);
          }
      });
      return deferred.promise;
    };
  }
});
