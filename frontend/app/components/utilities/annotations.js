(function (global) {

'use strict';

global.wg = global.wg || {}; 

global.wg.component = createComponent;
global.wg.service = createService;

function createComponent(moduleName, directiveName, options, controller) {
  const ctrl = controller || options;
  const opts = controller ? options : {};

  const prefixedDirectiveName = 'wg' + _.upperFirst(directiveName);
  const controllerAsName = directiveName + 'Ctrl';
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

function createService(moduleName, serviceName, controller) {
  const prefixedServiceName = 'wg' + _.upperFirst(serviceName);

  angular.module(moduleName)
    .factory(prefixedServiceName, controller);    
}

})(window);