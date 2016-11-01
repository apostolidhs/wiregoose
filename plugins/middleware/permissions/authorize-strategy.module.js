/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareAuthorizeStrategy', (
  $_, 
  $passportJwt, 
  logger, 
  config,
  modelsUser
) => {

  return {
    register
  };

  function register(passport) {
    var opts = {};
    opts.jwtFromRequest = $passportJwt.ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.JWT_SECRET;

    const strategy = new $passportJwt.Strategy(opts, (jwtPayload, done) => {
      modelsUser.findOne({id: jwtPayload.id})
        .then(user => done(null, user || false))
        .catch(reason => done(null, false));
    });

    passport.use(strategy);
  }

});
