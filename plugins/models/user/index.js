'use strict';

KlarkModule(module, 'krkModelsUser', (
  _,
  config,
  krkModelsUserExtension
) => {

  return krkModelsUserExtension.createSchema({
    validatedByAdmin: false,
    userAccountValidationPeriod: config.USER_ACCOUNT_VALIDATION_PERIOD,
    supportedLanguages: config.SUPPORTED_LANGUAGES,
    onSchemaOptions,
    onSchemaMethods
  });

  function onSchemaOptions(options) {
    options.facebook = {
      id: { type: String },
      token: { type: String }
    };
    return options;
  }

  function onSchemaMethods(schema) {
    schema.methods.getSafely = getSafely;
    schema.statics.findOrCreateFBUser = findOrCreateFBUser;
    return schema;
  }

  function getSafely() {
    var userObj = this.toObject();
    var safeUser = _.omit(userObj, [
      'password',
      'validationToken',
      'facebook'
    ]);

    safeUser.isEmailValid = !userObj.validationToken;
    safeUser.hasFacebookAccount = !!userObj.facebook;
    return safeUser;
  }

  function findOrCreateFBUser(accessToken, refreshToken, profile) {
    return this.findOne({
      'facebook.id': profile.id
    })
    .then(user => {
      if (user) {
        return user;
      }

      return this.create({
        email: profile.emails[0].value,
        role: 'USER',
        facebook: {
          id: profile.id,
          token: accessToken
        }
      });
    });
  }

});
