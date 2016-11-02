/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'generatorsCreateUser', ($mongoose, config, modelsUser) => {

  return {
    admin
  };

  function admin() {
    const user = new modelsUser({
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      role: 'ADMIN',
      preferences: {},
      validationToken: 'mockValidationToken'
    });   
    return user.save()
      .then(user => modelsUser.verifyAccount('mockValidationToken')
        .then(() => user));
  }

});