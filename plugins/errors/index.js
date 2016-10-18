/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'errors', (logger) => {

  return {
    build
  };

  function build() {
    const errorsDescr = getErrorsDescr();
    const errors = [];

    return {
      add,
      commit,
      isEmpty
    };

    function add(errorId, msg) {
      const errorDescr = errorsDescr[errorId];
      if (!errorDescr) {
        logger.error(`unexpected error code (${errorId})`);
      }
      errors.push({
        code: errorDescr[0],
        msg: msg || errorDescr[1]
      });
    }

    function commit() {
      return errors;
    }

    function isEmpty() {
      return errors.length === 0;
    }
  }

  function getErrorsDescr() {
    return {
      UNEXPECTED: [1001, 'unexpected'],
      NOT_FOUND: [1002, 'not found'],
      INVALID_PARAMS: [1003, 'invalid params']
    };
  }


});
