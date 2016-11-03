(function () {

'use strict';

wg.directive('wg.app.components.crud.all', 'crudAll', {
  templateUrl: 'components/crud/all/all.html',
  scope: {
    crudModel: '='
  }
}, function($scope, wgServicesApi, wgNgTableFactory) {

const ctrl = this;

ctrl.ngTableCrud = undefined;
ctrl.ngTableCols = undefined;

$scope.$watch(
  () => this.crudModel,
  (val) => val && updateCrudTable(val)
);

function updateCrudTable(model) {
  ctrl.ngTableCrud = wgNgTableFactory.dynamicCrud(model);  
  ctrl.ngTableCols = wgNgTableFactory.dynamicCrudCols(model);
}

})})();