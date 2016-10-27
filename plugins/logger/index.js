/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'logger', (router) => {

  return {
    log,
    info,
    warn,
    error,
    assert
  };

  function log() {
    console.log.apply(console, arguments);
  }

  function info() {
    console.info.apply(console, arguments);
  }

  function warn() {
    console.warn.apply(console, arguments);
  }

  function error() {
    console.error.apply(console, arguments);
  }

  function assert(cond, msg) {
    if (!cond) {
      throw new Error(msg);
    }
  }

});
