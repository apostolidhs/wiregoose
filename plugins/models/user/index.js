/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'modelsUser', (
  $_,
  $q,
  $mongoose, 
  $mongooseTypeEmail,    
  $mongooseCreatedmodified,  
  config,
  middlewarePermissionsRoles,
  dbMongoosePluginsPassword
) => {

  const schema = new $mongoose.Schema({
    email: {type: $mongoose.SchemaTypes.Email, required: true, unique: true},
    password: {type: String, required: true},
    lastLogin: {type: Date, required: true, default: Date.now},
    validationExpiresAt: { type: Date, default: Date.now, expires: config.USER_ACCOUNT_VALIDATION_PERIOD },
    validationToken: {type: String, maxlength: [64]},
    totalLogins: {type: Number, required: true, min: 0, default: 0},
    role: {type: String, enum: middlewarePermissionsRoles, required: true},
    preferences: {
      language: {type: String, enum: config.SUPPORTED_LANGUAGES}
    }
  });

  schema.plugin(dbMongoosePluginsPassword, { passwordField: 'password' });
  schema.plugin($mongooseCreatedmodified.createdModifiedPlugin);
  schema.methods.getSafely = getSafely; 
  schema.statics.verifyAccount = verifyAccount; 

  return $mongoose.model('User', schema);

  function getSafely() {
    const userObj = this.toObject();
    const safeUser = $_.omit(userObj, [
      'password', 
      'validationExpiresAt', 
      'validationToken'
    ]);

    return safeUser;
  }  

  function verifyAccount(validationToken) {
    const unset = {
      $unset: {
        validationExpiresAt: 1, 
        validationToken: 1
      }
    };
    return this.findOneAndUpdate({validationToken}, unset, {new: true});    
  }

});