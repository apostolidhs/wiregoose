/* jshint esversion:6, node:true  */

'use strict';

eamModule(module, 'crudGeneratorUrls', (config) => {

  return {
    create: urlWithoutId,
    update: urlWithId,
    retrieve: urlWithId,
    retrieveAll: urlWithoutId,
    delete: urlWithId,
    urlWithId,
    urlWithoutId
  };

  function urlWithId(name) {
    return `/${config.API_URL_PREFIX}/${name.toLowerCase()}/:id`;
  }

  function urlWithoutId(name) {
    return `/${config.API_URL_PREFIX}/${name.toLowerCase()}`;
  }

});