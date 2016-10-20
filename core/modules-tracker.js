/* jshint esversion:6, node:true  */

'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const _ = require('lodash');

module.exports = modulesTracker;

function modulesTracker() {
  const pluginsPath = path.join(__dirname, '../', 'plugins');
  const modules = pluginsPath + '/**/index.js';
  const subModules = pluginsPath + '/**/*.module.js';

  return glob.sync(modules)
    .concat(glob.sync(subModules));
}
