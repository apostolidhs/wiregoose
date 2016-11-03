(function () {

'use strict';

wg.service('wg.app.components.models', 'modelsUser', (wgModelsHolder) => {

const model = {
  schema: {
    email: {type: 'Email', required: true, unique: true},
    lastLogin: {type: 'Date', required: true, default: Date.now},
    validationExpiresAt: { type: 'Date', default: Date.now },
    totalLogins: {type: 'Number', required: true, min: 0, default: 0},
    role: {type: 'String', enum: 'userRoles', required: true}
    // preferences: {
    //   language: {type: 'String', enum: 'supportedLanguages'}
    // }
  },
  name: 'user'
};

wgModelsHolder.register(model);

return model;

})})();