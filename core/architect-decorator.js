/* jshint esversion:6, node:true  */

/*
  eamModule('provModule1', (module1, module2) => {
    return {}; // without wrapping in 'provModule1' object
  },
  module
  );

  Translates to the following architect registration:

    consumes -> ['module1', 'module2']
    provides -> ['provModule1']
    register -> register(null, {
                  provModule1: {}
                });
*/

'use strict';

const _ = require('lodash');
const moduleAlias = require('./module-alias');

module.exports = decorate;

function decorate(amd, moduleName, controller) {
  const dependencies = getParameterNames(controller);
  const innerDependencies = _.filter(dependencies, d => !_.startsWith(d, '$'));

  function setup(options, imports, register) {    
    const addArgument = (args, dependence) => {      
      if (_.startsWith(dependence, '$')) {
        let normalizedDependency = dependence.substr(1);
        normalizedDependency = toKebabCaseOnlyCharacters(normalizedDependency);
        const aliasDependency = moduleAlias[normalizedDependency];
        if (aliasDependency) {
          normalizedDependency = aliasDependency;
        }
        args.push(require(normalizedDependency));
      } else {
        args.push(imports[dependence])
      }
    };
    const args = _.transform(dependencies, addArgument, []);
    const exportVals = controller.apply(undefined, args);

    const registerVal = {};
    registerVal[moduleName] = exportVals || {};

    return register(null, registerVal);
  }

  if (!_.isEmpty(innerDependencies)) {
    setup.consumes = innerDependencies;
  }

  setup.provides = [moduleName];

  amd.exports = setup;
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParameterNames(func) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  return result === null ? [] : result;
}

function toKebabCaseOnlyCharacters(str) {
  let kebab = '';
  _.each(str, (c, idx) => {
    const nextChar = str[idx + 1];
    kebab += c.toLowerCase();    
    if (isAlphaNumericUpperCase(nextChar)) {
      kebab += '-';
    }
  });
  return kebab;
}

function isAlphaNumericUpperCase(c) {
  return c && /^[a-z0-9]+$/i.test(c) && c === c.toUpperCase();  
}