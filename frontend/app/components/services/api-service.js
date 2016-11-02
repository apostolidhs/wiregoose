(function () {

'use strict';

wg.service('wg.app.components.services', 'servicesApi', (wgConfig) => {

let jwtToken;
let user;

return {
  authorize: {
    isAuthorized,
    getUser,
    getToken,
    login
  },
  crud: {
    create: crudCreate,
    retrieve: crudRetrieve,
    retrieveAll: crudRetrieveAll,
    update: crudUpdate,
    delete: crudDelete
  }
};

function isAuthorized() {
  return !!jwtToken;
}

function getUser() {
  return user;
}

function getToken() {
  return jwtToken;
}

      // headers: {
      //   'Authorization': 'token'
      // },
function login(email, password) {
  return $.ajax({
    url: `${wgConfig.APP_URL}/authorize/login`,
    method: 'POST',
    data: JSON.stringify({email, password}),
    contentType: 'application/json',
    dataType: 'json'
  })
  .then(session => {
    jwtToken = session.data;
    const data = jwt_decode(jwtToken);
    user = data.user;
    return user;
  });
}

function crudCreate() {

}

function crudRetrieve() {

}

function crudRetrieveAll(model, opts) {
  const params = {};
  _.assignIn(params, opts.pagination, opts.filters);
  const urlParams = $.param(params);

  return $.ajax({
    url: `${wgConfig.APP_URL}/${model.name}?${urlParams}`,
    method: 'GET',    
    headers: {
      'Authorization': jwtToken
    },
    contentType: 'application/json',
    dataType: 'json'    
  });
}

function crudUpdate() {

}

function crudDelete() {

}


});

})();