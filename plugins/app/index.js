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
  $moment,
  $helmet,
  $passport,
  $expressDevice,
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
  proxy,
  emailVerifyAccountTmpl,
  emailResetPasswordTmpl,
  authorizationFacebookStrategy,
  rssRegistrationsFetcher,
  routesRssFeedFetchRssFeed,
  routesRssFeedFetchRssRegistrations,
  routesCrud,
  routesStatics,
  routesEntry,
  routesMeasures,
  routesArticle,
  routesTimeline,
  routesProxy,
  routesAuthorization,
  routesBookmarks,
  parameterValidatorsCustomExpressValidators,
  render,
  measuresRssRegistrationsFetches
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
    authorizationFacebookStrategy.register($passport);
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
        MEASURES_FAILED: [7001, 'measures failed'],
        PROXY_FAILED: [8001, 'proxy failed'],
        MAX_BOOKMARKS_PER_USER: [4010, 'maximum bookmarks reached']
      }
    }));

    app.use($morgan('dev'));
    app.use($bodyParser.json());
    app.use($bodyParser.urlencoded({ extended: false }));
    app.use($expressValidator({
      customValidators: parameterValidatorsCustomExpressValidators.getValidators()
    }));
    app.use($cookieParser());
    app.use($expressDevice.capture());

    const adminPagePath = $path.resolve(__dirname, '../../', 'public', 'admin.html');
    const indexPagePath = $path.resolve(__dirname, '../../', 'public', 'index.html');
    const middlewarePreRender = render.createMiddlewareCachedPreRender(indexPagePath);

    if (config.VALIDATION_GOOGLE_FILE) {
      const googlePagePath = $path.resolve(__dirname, '../../', 'public', config.VALIDATION_GOOGLE_FILE);
      app.get(`/${config.VALIDATION_GOOGLE_FILE}`, (req, res) => res.sendFile(googlePagePath));
    }

    app.get('/admin', (req, res) => res.sendFile(adminPagePath));
    app.get('/', middlewarePreRender);
    app.get('/index.html', middlewarePreRender);

    app.use($express.static($path.join(__dirname, '../../', 'public')));

    krkRoutesServerInfo.register(app, {
      apiVersion: config.API_VERSION
    });
    const routesConfig = {
      apiUrlPrefix: config.API_URL_PREFIX,
      apiUrl: config.API_URL,
      name: config.NAME,
      emailSmtp: config.EMAIL_SMTP,
      emailName: config.EMAIL_NAME,
      emailAddress: config.EMAIL_ADDRESS
    };
    krkRoutesAuthorize.register(app, {
      appUrl: config.APP_URL,
      adminValidationOnSignup: false,
      verifyAccountEmailTmpl: opts => emailVerifyAccountTmpl.template(opts),
      resetPasswordEmailTmpl: opts => emailResetPasswordTmpl.template(opts),
      ...routesConfig
    });
    krkRoutesUsers.register(app, {
      verifyAccountEmailTmpl: opts => emailVerifyAccountTmpl.template(opts),
      ...routesConfig
    });
    registerRoutes(app);

    app.get('*', middlewarePreRender);

    app.use(krkRouter);

    startPeriodicalProcesses();

    app.use(krkMiddlewareResponse.fail);

    return app;
  }

  function registerRoutes(app) {
    _.each([
      routesTimeline,
      routesArticle,
      routesMeasures,
      routesEntry,
      routesRssFeedFetchRssRegistrations,
      routesRssFeedFetchRssFeed,
      routesCrud,
      routesStatics,
      routesProxy,
      routesAuthorization,
      routesBookmarks
    ], route => route.register(app));
  }

  function startPeriodicalProcesses() {
    if (config.ENABLE_RSS_REGISTRATIONS_FETCH) {
      rssRegistrationsFetcher.startPeriodicalFetchProcess();
    }
    proxy.startPeriodicalCacheInvalidation();
    measuresRssRegistrationsFetches.startPeriodicalMeasureCaching();
  }

  function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  }

});
