/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'app', (
  $express,
  $path,
  $serveFavicon,
  $expressValidator, 
  $bodyParser,
  $cookieParser,
  $morgan,
  router,
  mongooseConnector, 
  middlewareInitiateResponseParams
) => {
  const app = $express();
  app.use($morgan('dev'));
  app.use($bodyParser.json());
  app.use($bodyParser.urlencoded({ extended: false }));
  app.use($expressValidator());
  app.use($cookieParser());
  app.use($express.static($path.join(__dirname, 'public')));

  app.use(middlewareInitiateResponseParams);
  app.use(router);

  mongooseConnector.connect();

  return app;
});
