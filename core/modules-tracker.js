/* jshint esversion:6, node:true  */

'use strict';

const path = require('path');
const globby = require('globby');
const fs = require('fs');
const _ = require('lodash');
const argv = require('yargs').argv;

module.exports = modulesTracker;

function modulesTracker() {

  const pluginsPath = path.join(__dirname, '../', 'plugins');

  const modules = `${pluginsPath}/**/index.js`;
  const subModules = `${pluginsPath}/**/*.module.js`;
  const testModules = `${pluginsPath}/**/*-test.module.js`;
  const serverStartModule = `${pluginsPath}/server/index.js`;
  const scriptModules = `${pluginsPath}/scripts`;

  const srcPaths = [
    modules,
    subModules
  ];

  const script = argv.script;
  if (script) {
    const scriptPath = `${pluginsPath}/scripts/${script}.js`;
    srcPaths.push(scriptPath);
    srcPaths.push(`!${serverStartModule}`);
    srcPaths.push(`!${testModules}`);
  } else if (process.env.UNIT_TEST) {
    srcPaths.push(`!${serverStartModule}`);
    srcPaths.push(`!${scriptModules}`);
  } else {
    srcPaths.push(`!${testModules}`);
    srcPaths.push(`!${scriptModules}`);
  }

  const appModules = globby.sync(srcPaths);

  return appModules;
}
