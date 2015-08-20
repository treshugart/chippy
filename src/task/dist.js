'use strict';

var config = require('../lib/config');
var del = require('del');
var distJs = require('./dist/js');
var distLess = require('./dist/less');
var mac = require('mac');

module.exports = mac.series(
  function (done) {
    del(config('dist.destination'), done);
  },
  mac.parallel(
    distJs,
    distLess
  )
);
