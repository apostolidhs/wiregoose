(function () {

'use strict';

wg.service('wg.app.components.models', 'modelsHolder', () => {

const models = {};

return {
  register,
  get,
  getAll
};

function register(model) {
  models[model.name] = model;
}

function get(name) {
  return models[name]
}

function getAll() {
  return _.values(models);
}

});

})();