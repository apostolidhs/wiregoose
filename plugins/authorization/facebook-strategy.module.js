'use strict';

KlarkModule(module, 'authorizationFacebookStrategy', function(
  $passportFacebookToken,
  krkModelsUser,
  config
) {

  return {
    register: register
  };

  function register(passport) {
    const fbCredentials = {
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET
    };
    const strategy = new $passportFacebookToken(
      fbCredentials,
      handleFacebookCredentials
    );

    passport.use(strategy);
  }

  function handleFacebookCredentials(accessToken, refreshToken, profile, done) {
    krkModelsUser.findOrCreateFBUser(accessToken, refreshToken, profile)
      .then(user => done(null, user || false))
      .catch(reason => done(null, false));
  }

});
