'use strict';

(function () {

  'use strict';

  angular.module('wg.app', ['ngAnimate', 'toastr', 'ngSanitize', 'ngTable', 'cgBusy', 'ui.router', 'wg.app.components.config', 'wg.app.components.crud.all', 'wg.app.components.models', 'wg.app.components.services']).value('cgBusyDefaults', {
    templateUrl: 'components/theming/cg-busy-template.html',
    minDuration: 200
  }).config(function ($urlRouterProvider) {
    // $urlRouterProvider.otherwise('/mixedItems');
  }).controller('AppController', AppController);

  function AppController($scope, wgModelsCategory, wgServicesApi) {
    this.crudModel = wgModelsCategory;

    wgServicesApi.authorize.login('john.apostolidi@gmail.com', '123456789').then(function (session) {
      $scope.session = session;
    });
  }
})();
'use strict';

(function () {

  'use strict';

  angular.module('wg.app.components.config', []);
})();
'use strict';

(function () {

  'use strict';

  angular.module('wg.app.components.crud.all', []);
})();
'use strict';

(function () {

  'use strict';

  angular.module('wg.app.components.models', []);
})();
'use strict';

(function () {

  'use strict';

  angular.module('wg.app.components.services', []);
})();
'use strict';

(function (global) {

  'use strict';

  global.wg = global.wg || {};

  global.wg.component = createComponent;
  global.wg.service = createService;

  function createComponent(moduleName, directiveName, options, controller) {
    var ctrl = controller || options;
    var opts = controller ? options : {};

    var prefixedDirectiveName = 'wg' + _.upperFirst(directiveName);
    var controllerAsName = directiveName + 'Ctrl';
    var defaultDirectiveParams = {
      controller: ctrl,
      restrict: 'E',
      scope: {},
      bindToController: true,
      controllerAs: controllerAsName
    };

    _.assignIn(defaultDirectiveParams, opts);

    angular.module(moduleName).directive(prefixedDirectiveName, function () {
      return defaultDirectiveParams;
    });
  }

  function createService(moduleName, serviceName, controller) {
    var prefixedServiceName = 'wg' + _.upperFirst(serviceName);

    angular.module(moduleName).factory(prefixedServiceName, controller);
  }
})(window);
'use strict';

(function () {

  'use strict';

  wg.service('wg.app.components.config', 'config', function () {

    wg.config.SUPPORTED_LANGUAGES = wg.config.SUPPORTED_LANGUAGES.split(',');

    return wg.config;
  });
})();
'use strict';

(function () {

  'use strict';

  wg.component('wg.app.components.crud.all', 'crudAll', {
    templateUrl: 'components/crud/all/all.html',
    scope: {
      crudModel: '='
    }
  }, function ($scope) {});
})();
'use strict';

(function () {

  'use strict';

  wg.service('wg.app.components.models', 'modelsCategory', function () {

    return {
      schema: {
        name: { type: String, required: true, unique: true, index: true, maxlength: [64] }
      },
      name: 'category'
    };
  });
})();
'use strict';

(function () {

  'use strict';

  wg.service('wg.app.components.services', 'servicesApi', function (wgConfig) {

    var jwtToken = void 0;

    return {
      authorize: {
        isAuthorized: isAuthorized,
        getUser: getUser,
        getToken: getToken,
        login: login
      },
      crud: {
        crudCreate: crudCreate,
        crudRetrieve: crudRetrieve,
        crudRetrieveAll: crudRetrieveAll,
        crudUpdate: crudUpdate,
        crudDelete: crudDelete
      }
    };

    function isAuthorized() {
      return !!jwtToken;
    }

    function getUser() {}

    function getToken() {
      return jwtToken;
    }

    // headers: {
    //   'Authorization': 'token'
    // },
    function login(email, password) {
      return $.ajax({
        url: wgConfig.APP_URL + '/authorize/login',
        method: 'POST',
        data: { email: email, password: password },
        dataType: 'json'
      }).then(function (session) {});
    }

    function crudCreate() {}

    function crudRetrieve() {}

    function crudRetrieveAll(model) {
      return $resource(wgConfig.APP_URL + '/' + model.name, {}, {
        query: {
          method: 'GET',
          responseType: 'json',
          headers: {
            'Authorization': 'token'
          }
        }
      });
    }

    function crudUpdate() {}

    function crudDelete() {}
  });
})();