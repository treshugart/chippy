'use strict';

var commander = require('../../lib/commander');
var config = require('../../lib/config');
var galvatron = require('../../lib/galvatron')('dist.js');
var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var mac = require('mac');

module.exports = mac.series(
  function () {
    var bundle = galvatron.bundle(config('dist.js.source'));
    return gulp.src(bundle.files)
      .pipe(bundle.watchIf(commander.watch))
      .pipe(bundle.stream())
      .pipe(gulpRename({
        basename: config('dist.js.name')
      }))
      .pipe(gulp.dest(config('dist.js.destination')));
  }
);
