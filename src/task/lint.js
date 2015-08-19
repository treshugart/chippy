'use strict';

var config = require('../lib/config');
var sh = require('shelljs');

var paths = config('lint.paths').join(' ');

module.exports = function () {
  if (paths) {
    sh.exec('./node_modules/.bin/jshint ' + paths);
    // Enable once ES6 support lands.
    // sh.exec('./node_modules/.bin/jscs ' + paths);
  }
};
