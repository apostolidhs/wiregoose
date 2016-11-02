(function () {

'use strict';

angular.module('wg.app', [
  'ngAnimate',
  'toastr',
  'ngSanitize',
  'ngTable',
  'cgBusy',
  'ui.router',
  'wg.app.components.config',
  'wg.app.components.ngTableFactory',
  'wg.app.components.crud.all',
  'wg.app.components.models',
  'wg.app.components.services'  
])

.run(() => (window.wg = window.wg || {}).assert = (cond, msg) => console.assert(cond, msg))

.value('cgBusyDefaults', {
  templateUrl: 'components/theming/cg-busy-template.html',
  minDuration: 200
})

.config($urlRouterProvider => {
  // $urlRouterProvider.otherwise('/mixedItems');
})

.controller('AppController', AppController);

function AppController($scope, wgModelsCategory, wgServicesApi) {
  const ctrl = this;
  ctrl.crudModel = wgModelsCategory;

  
  wgServicesApi.authorize.login('john.apostolidi@gmail.com', '123456789')
    .then((session) => {
      ctrl.session = session;
      $scope.$digest();
    })
}

})();