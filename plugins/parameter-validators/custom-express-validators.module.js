/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'parameterValidatorsCustomExpressValidators', (
  _,
  config
) => {
  return {
    getValidators
  }

  function getValidators() {
    return {
      isLang: (value) => {
        return _.isString(value)
          && _.includes(config.SUPPORTED_LANGUAGES, value);
      }
    };
  }
});
