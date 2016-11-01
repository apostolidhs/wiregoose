(function () {

'use strict';

wg.service('wg.app.components.models', 'modelsCategory', () => {

 return {
    schema: {
      name: {type: String, required: true, unique: true, index: true, maxlength: [64]}
    },
    name: 'category'
  };

});

})();