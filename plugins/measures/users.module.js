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
      pendingValidation()
    ])
    .then(([total, pendingValidation]) => ({total, pendingValidation}));
  }

  function totalUsers() {
    return krkModelsUser.count();
  }

  function pendingValidation() {
    return krkModelsUser.count({ validationToken: { $exists: false } });
  }

});
