/* jshint esversion:6, node:true  */

'use strict';

const path = require('path');
const architect = require('architect');
const architectDecorator = require('./architect-decorator.js');

GLOBAL.eamModule = architectDecorator;

const architectConfig = architect.loadConfig(path.join(__dirname, 'plugins.js'));

architect.createApp(architectConfig, (err, architectApp) => {
  if (err) {
    console.error('Something went really wrong in the initialization of the architect');
    console.error(err);
    if (err.stack) {
      console.error(err.stack);
    }
  }
})
.on('error', err => console.error(err));
