(function () {

'use strict';

wg.controller('wg.app.sections.admin.crud', 'adminCrudAll', 

function($scope, $stateParams, wgModelsHolder) {

const ctrl = this;

ctrl.crudModel = undefined;

$scope.$watch(
  () => $stateParams.crudModelName,
  (val) => val && updateCrudModel(val)   
);

function updateCrudModel(val) {
  const model = wgModelsHolder.get(val || 'category');
  ctrl.crudModel = model;
}



})})();