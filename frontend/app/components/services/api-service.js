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
    crudCreate,
    crudRetrieve,
    crudRetrieveAll,
    crudUpdate,
    crudDelete
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
    data: {email, password},
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

function crudRetrieveAll(model) {
  return $resource(`${wgConfig.APP_URL}/${model.name}`, {}, {
    query: {
      method: 'GET',
      responseType: 'json',
      headers: {
        'Authorization': 'token'
      }
    }
  })
}

function crudUpdate() {

}

function crudDelete() {

}


});

})();