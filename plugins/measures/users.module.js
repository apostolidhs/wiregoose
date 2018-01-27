/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'measuresUsers', (
  _,
  krkModelsUser
) => {

  return {
    measure
  };

  function measure() {
    return Promise.all([
      totalUsers(),
      pendingValidation(),
      facebookUsers()
    ])
    .then(([total, pendingValidation, facebookUsers]) =>
      ({total, pendingValidation, facebookUsers}));
  }

  function totalUsers() {
    return krkModelsUser.count();
  }

  function pendingValidation() {
    return krkModelsUser.count({ validationToken: { $exists: true } });
  }

  function facebookUsers() {
    return krkModelsUser.count({ facebook: { $exists: true } });
  }

});
