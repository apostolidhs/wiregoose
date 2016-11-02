'use strict';

(function () {

  'use strict';

  angular.module('wg.app', ['ngAnimate', 'toastr', 'ngSanitize', 'ngTable', 'cgBusy', 'ui.router', 'wg.app.components.config', 'wg.app.components.ngTableFactory', 'wg.app.components.crud.all', 'wg.app.components.models', 'wg.app.components.services']).run(function () {
    return (window.wg = window.wg || {}).assert = function (cond, msg) {
      return console.assert(cond, msg);
    };
  }).value('cgBusyDefaults', {
    templateUrl: 'components/theming/cg-busy-template.html',
    minDuration: 200
  }).config(function ($urlRouterProvider) {
    // $urlRouterProvider.otherwise('/mixedItems');
  }).controller('AppController', AppController);

  function AppController($scope, wgModelsCategory, wgServicesApi) {
    var ctrl = this;
    ctrl.crudModel = wgModelsCategory;

    wgServicesApi.authorize.login('john.apostolidi@gmail.com', '123456789').then(function (session) {
      ctrl.session = session;
      $scope.$digest();
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

  angular.module('wg.app.components.ngTableFactory', []);
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
  }, function ($scope, wgServicesApi, wgNgTableFactory) {
    var _this = this;

    var ctrl = this;

    ctrl.ngTableCrud = undefined;
    ctrl.ngTableCols = undefined;

    $scope.$watch(function () {
      return _this.crudModel;
    }, function (val) {
      return val && updateCrudTable(val);
    });

    function updateCrudTable(model) {
      ctrl.ngTableCrud = wgNgTableFactory.dynamicCrud(model);
      ctrl.ngTableCols = wgNgTableFactory.dynamicCrudCols(model);
    }
  });
})();
'use strict';

(function () {

  'use strict';

  wg.service('wg.app.components.models', 'modelsCategory', function () {

    return {
      schema: {
        name: { type: 'String', required: true, unique: true, index: true, maxlength: [64] }
      },
      name: 'category'
    };
  });
})();
'use strict';

(function () {

  'use strict';

  wg.service('wg.app.components.ngTableFactory', 'ngTableFactory', function (NgTableParams, wgServicesApi) {

    return {
      dynamicCrud: dynamicCrud,
      dynamicCrudCols: dynamicCrudCols
    };

    function dynamicCrud(model) {
      var tableParams = {
        page: 1, // show first page
        count: 10, // count per page
        sorting: {}
      };

      var tableSettings = {
        filterDelay: 300,
        getData: function getData(params) {
          var opts = {};

          opts.pagination = {
            count: params.count(),
            page: params.page()
          };

          var paramSorting = _.first(_.toPairs(params.sorting()));
          if (!_.isEmpty(paramSorting)) {
            opts.pagination.sortBy = paramSorting[0];
            opts.pagination.asc = paramSorting[1] === 'asc' ? 'true' : 'false';
          }

          var filters = _.transform(params.filter(), function (result, value, key) {
            if (!(_.isNil(value) || _.isString(value) && !value)) {
              result[key] = valueToFilter(value);
            }
          }, {});

          if (!_.isEmpty(filters)) {
            opts.filters = filters;
          }

          return wgServicesApi.crud.retrieveAll(model, opts).then(function (resp) {
            params.total(resp.data.total);
            return resp.data.content;
          });
        }
      };
      return new NgTableParams(tableParams, tableSettings);
    }

    function dynamicCrudCols(model) {
      var schemaCols = _.map(model.schema, function (opts, name) {
        var col = {
          show: true,
          field: name,
          title: name
        };
        if (opts.type === 'String') {
          col.sortable = name;
          col.filter = _.fromPairs([[name, 'text']]);
        } else {
          wg.assert(false, 'unsupported content type: ' + opts.type);
        }
        return col;
      });

      var IdCol = {
        show: true,
        field: '_id',
        title: 'id',
        sortable: '_id'
      };

      return [].concat(IdCol).concat(schemaCols);
    }

    function valueToFilter(value) {
      return value;
    }
  });
})();
'use strict';

(function () {

  'use strict';

  wg.service('wg.app.components.services', 'servicesApi', function (wgConfig) {

    var jwtToken = void 0;
    var user = void 0;

    return {
      authorize: {
        isAuthorized: isAuthorized,
        getUser: getUser,
        getToken: getToken,
        login: login
      },
      crud: {
        create: crudCreate,
        retrieve: crudRetrieve,
        retrieveAll: crudRetrieveAll,
        update: crudUpdate,
        delete: crudDelete
      }
    };

    function isAuthorized() {
      return !!jwtToken;
    }

    function getUser() {
      return user;
    }

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
        data: JSON.stringify({ email: email, password: password }),
        contentType: 'application/json',
        dataType: 'json'
      }).then(function (session) {
        jwtToken = session.data;
        var data = jwt_decode(jwtToken);
        user = data.user;
        return user;
      });
    }

    function crudCreate() {}

    function crudRetrieve() {}

    function crudRetrieveAll(model, opts) {
      var params = {};
      _.assignIn(params, opts.pagination, opts.filters);
      var urlParams = $.param(params);

      return $.ajax({
        url: wgConfig.APP_URL + '/' + model.name + '?' + urlParams,
        method: 'GET',
        headers: {
          'Authorization': jwtToken
        },
        contentType: 'application/json',
        dataType: 'json'
      });
    }

    function crudUpdate() {}

    function crudDelete() {}
  });
})();
//# sourceMappingURL=wiregoose.js.map
