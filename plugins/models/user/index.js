'use strict';

KlarkModule(module, 'krkModelsUser', (
  config,
  krkModelsUserExtension
) => {

  return krkModelsUserExtension.createSchema({
    validatedByAdmin: false,
    userAccountValidationPeriod: config.USER_ACCOUNT_VALIDATION_PERIOD,
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

    if (!userObj.validationToken) {
      safeUser.isEmailValid = true;
    }

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
