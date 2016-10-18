/* jshint esversion:6, node:true  */

'use strict';

const path = require('path');
const glob = require('glob');
const fs = require('fs');
const _ = require('lodash');

module.exports = modulesTracker;

function modulesTracker() {
  let pluginsPath = path.join(__dirname, '../', 'plugins');
  pluginsPath += '/**/index.js';
  return glob.sync(pluginsPath);
}
