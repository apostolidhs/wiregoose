/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'errors', ($_, logger) => {

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

      msg = msg || errorDescr[1]; 
         
      errors.push({
        code: errorDescr[0],
        msg: $_.isError(msg) ? {
          msg: msg.message,
          stack: msg.stack
        } : msg
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
      INVALID_PARAMS: [1003, 'invalid params'],

      DB_ERROR: [2001, 'database error'],

      RSS_FEED_FETCH_FAIL: [3001, 'rss feed fetch failed'],
      RSS_REGISTRATIONS_FETCH_FAIL: [3002, 'rss registrations fetch failed']
    };
  }


});
