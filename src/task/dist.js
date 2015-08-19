'use strict';

var commander = require('../lib/commander');
var config = require('../lib/config');
var del = require('del');
var galvatron = require('../lib/galvatron')('dist');
var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var mac = require('../lib/mac');

module.exports = mac.series(
  function (done) {
    del(config('dist.destination'), done);
  },

  function () {
    var bundle = galvatron.bundle(config('dist.source'));
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(commander.watch))
      .pipe(bundle.stream())
      .pipe(gulpRename({
        basename: config('dist.name')
      }))
      .pipe(gulp.dest(config('dist.destination')))
      .pipe(gulpUglify())
      .pipe(gulpRename({
        suffix: config('dist.minSuffix')
      }))
      .pipe(gulp.dest(config('dist.destination')));
  }
);
