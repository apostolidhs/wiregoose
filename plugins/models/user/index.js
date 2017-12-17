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
    options.facebookProvider = {
      type: {
        id: String,
        token: String
      }
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
      'facebookProvider'
    ]);

    safeUser.isEmailValid = !userObj.validationToken;
    return safeUser;
  }

  function findOrCreateFBUser(accessToken, refreshToken, profile) {
    return this.findOne({
      'facebookProvider.id': profile.id
    })
    .then(user => {
      if (user) {
        return user;
      }

      return this.save({
        email: profile.mails[0].value,
        role: 'USER',
        facebookProvider: {
          id: profile.id,
          token: accessToken
        }
      });
    });
  }

});
