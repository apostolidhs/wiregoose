/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'app', (
  _,
  q,
  $express,
  $path,
  $serveFavicon,
  $expressValidator,
  $bodyParser,
  $cookieParser,
  $morgan,
  $mongoose,
  $moment,
  $passport,
  krkPromiseExtension,
  krkRouter,
  krkDbMongooseConnector,
  krkMiddlewareInitiateResponseParams,
  krkMiddlewareResponse,
  krkRoutesAuthorize,
  krkMiddlewarePermissions,
  krkMiddlewarePermissionsAuthorizeStrategy,
  krkRoutesServerInfo,
  krkRoutesUsers,
  config,
  rssRegistrationsFetcher,
  routesRssFeedFetchRssFeed,
  routesRssFeedFetchRssRegistrations,
  routesCrud,
  routesStatics,
  routesEntry,
  routesMeasures,
  routesArticle,
  parameterValidatorsCustomExpressValidators
) => {

  return {
    create
  };

  function create() {
    $moment.locale('el');
    krkPromiseExtension.extend(q);
    krkDbMongooseConnector.connect(config.MONGODB_URL);
    krkMiddlewarePermissions.setOptions({
      expirationPeriod: config.JWT_EXPIRATION_PERIOD,
      secret: config.JWT_SECRET
    });
    krkMiddlewarePermissionsAuthorizeStrategy.register($passport, config.JWT_SECRET);
    krkMiddlewareResponse.setOptions({
      showStackError: config.IS_DEV
    });
    return createApp();
  }

  function createApp() {
    const app = $express();

    app.use(allowCrossDomain);
    if (config.RUN_MODE === 'dist') {
      app.use($helmet());
    }
    app.use(krkMiddlewareInitiateResponseParams({
      name: config.NAME,
      version: config.API_VERSION,
      errors: {
        RSS_FEED_FETCH_FAIL: [3001, 'rss feed fetch failed'],
        RSS_REGISTRATIONS_FETCH_FAIL: [3002, 'rss registrations fetch failed'],
        ARTICLE_MINING_FAIL: [6001, 'article mining failed'],
        MEASURES_FAILED: [7001, 'measures failed']
      }
    }));

    app.use($morgan('dev'));
    app.use($bodyParser.json());
    app.use($bodyParser.urlencoded({ extended: false }));
    app.use($expressValidator({
      customValidators: parameterValidatorsCustomExpressValidators.getValidators()
    }));
    app.use($cookieParser());
    app.use($express.static($path.join(__dirname, '../../', 'public')));

    krkRoutesServerInfo.register(app, {
      apiVersion: config.API_VERSION
    });
    krkRoutesAuthorize.register(app, {
      appUrl: config.APP_URL,
      apiUrlPrefix: config.API_URL_PREFIX,
      apiUrl: config.API_URL,
      name: config.NAME,
      EMAIL_SMTP: config.EMAIL_SMTP,
      EMAIL_NAME: config.EMAIL_NAME,
      EMAIL_ADDRESS: config.EMAIL_ADDRESS,
      adminValidationOnSignup: false
    });
    krkRoutesUsers.register(app, {
      apiUrlPrefix: config.API_URL_PREFIX,
      apiUrl: config.API_URL,
      name: config.NAME,
      EMAIL_SMTP: config.EMAIL_SMTP,
      EMAIL_NAME: config.EMAIL_NAME,
      EMAIL_ADDRESS: config.EMAIL_ADDRESS
    });
    registerRoutes(app);

    app.use(krkRouter);

    startPeriodicalProcesses();

    app.use(krkMiddlewareResponse.fail);

    return app;
  }

  function registerRoutes(app) {
    _.each([
      routesArticle,
      routesMeasures,
      routesEntry,
      routesRssFeedFetchRssRegistrations,
      routesRssFeedFetchRssFeed,
      routesCrud,
      routesStatics
    ], route => route.register(app));
  }

  function startPeriodicalProcesses() {
    if (config.ENABLE_RSS_REGISTRATIONS_FETCH) {
      rssRegistrationsFetcher.startPeriodicalFetchProcess();
    }
  }

  function allowCrossDomain(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      next();
  }

});
