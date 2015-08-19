'use strict';

var commander = require('../lib/commander');
var config = require('../lib/config');
var del = require('del');
var galvatron = require('galvatron')('lib');
var gulp = require('gulp');
var mac = require('mac');
var path = require('path');

var cwd = process.cwd();
var src = path.join(cwd, path.dirname(config('lib.source')));
var lib = path.join(cwd, config('lib.destination'));

module.exports = mac.series(
  function (done) {
    del(lib, done);
  },

  function () {
    var bundle = galvatron.bundle(config('lib.source'));

    bundle.all.forEach(function (file) {
      var srcFile = path.relative(src, file);
      var destFile = path.join(config('lib.destination'), srcFile);
      var destDir = path.dirname(destFile);

      gulp
        .src(file)
        .pipe(bundle.watchIf(commander.watch))
        .pipe(bundle.streamOne())
        .pipe(gulp.dest(destDir));
    });
  }
);
