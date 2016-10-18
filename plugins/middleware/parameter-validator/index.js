/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'middlewareParameterValidator', (parameterValidator) => {

  return {
    crud: {
      retrieve: crudRetrieveValidator
    }
  };

  function crudRetrieveValidator() {
    return (req, res, next) => {
      const params = {};
      params.id = parameterValidator.vaidations.paramId(req);
      parameterValidator.checkForErrors(params, req, res, next);
    }
  }

});