/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'dbMongoosePluginsPassword', ($_, $q, $bcrypt, logger) => {

  return passwordPlugin;

  function passwordPlugin(schema, options) {

    const passField = options.passwordField;
    logger.assert($_.isString(passField));   

    schema.pre('save', encryptPassword);    
    schema.methods.comparePassword = comparePassword; 

    function encryptPassword(next) {
      const user = this;

      if (!this.isModified(passField) && !this.isNew) {
        return next();
      }

      $q.promisify(cb => $bcrypt.genSalt(10, cb))
        .then(salt => $q.promisify(cb => $bcrypt.hash(user.password, salt, cb)))
        .then(hash => user[passField] = hash)
        .then(() => next(user))
        .catch(reason => next(reason));
    }

    function comparePassword(password) {
      return $q.promisify(cb => $bcrypt.compare(password, this.password, cb))
        .then(isMatch => {
          if (isMatch) {
            return true;
          }
          throw new Error(false);
        })
        .catch(reason => cb(reason));
    }
  }

});