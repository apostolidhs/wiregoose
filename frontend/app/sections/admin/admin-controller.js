(function () {

'use strict';

wg.controller('wg.app.sections.admin.crud', 'adminCrud', 

function($scope, $stateParams, wgModelsHolder) {

const ctrl = this;

ctrl.crudModels = wgModelsHolder.getAll();

})})();