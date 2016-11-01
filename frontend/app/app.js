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
  'wg.app.components.crud.all',
  'wg.app.components.models',
  'wg.app.components.services'  
])

.value('cgBusyDefaults', {
  templateUrl: 'components/theming/cg-busy-template.html',
  minDuration: 200
})

.config($urlRouterProvider => {
  // $urlRouterProvider.otherwise('/mixedItems');
})

.controller('AppController', AppController);

function AppController($scope, wgModelsCategory, wgServicesApi) {
  this.crudModel = wgModelsCategory;

  
  wgServicesApi.authorize.login('john.apostolidi@gmail.com', '123456789')
    .then((session) => {
      $scope.session = session;
    })
}

})();