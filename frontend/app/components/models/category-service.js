(function () {

'use strict';

wg.service('wg.app.components.models', 'modelsCategory', (wgModelsHolder) => {

const model = {
  schema: {
    name: {type: 'String', required: true, unique: true, index: true, maxlength: [64]}
  },
  name: 'category'
};

wgModelsHolder.register(model);

return model;

})})();