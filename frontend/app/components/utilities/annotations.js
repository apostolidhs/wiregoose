(function (global) {

'use strict';

global.wg = global.wg || {}; 

global.wg.directive = createDirective;
global.wg.controller = createController;
global.wg.service = createService;

function createDirective(moduleName, directiveName, options, controller) {
  const ctrl = controller || options;
  const opts = controller ? options : {};

  const prefixedDirectiveName = 'wg' + _.upperFirst(directiveName);
  const controllerAsName = `${directiveName}Ctrl`;
  const defaultDirectiveParams = {
    controller: ctrl,
    restrict: 'E',
    scope: {},
    bindToController: true,
    controllerAs: controllerAsName
  };

  _.assignIn(defaultDirectiveParams, opts);

  angular.module(moduleName)
    .directive(prefixedDirectiveName, () => defaultDirectiveParams);
}

function createController(moduleName, controllerName, controller) {
  angular.module(moduleName)
    .controller(`${controllerName}Controller`, controller);
}

function createService(moduleName, serviceName, controller) {
  const prefixedServiceName = 'wg' + _.upperFirst(serviceName);

  angular.module(moduleName)
    .factory(prefixedServiceName, controller);    
}

})(window);