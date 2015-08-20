'use strict';

var distJs = require('./dist/js');
var distLess = require('./dist/less');
var mac = require('mac');

module.exports = mac.series(
  mac.parallel(
    distJs,
    distLess
  )
);
