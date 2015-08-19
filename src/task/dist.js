'use strict';

var commander = require('../lib/commander');
var config = require('../lib/config');
var del = require('del');
var galvatron = require('../lib/galvatron')('dist');
var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var mac = require('mac');
var path = require('path');

module.exports = mac.series(
  function (done) {
    del(config('dist.destination'), done);
  },

  function () {
    var bundle = galvatron.bundle(config('dist.source'));
    return gulp.src(bundle.files)
      .pipe(bundle.watchIf(commander.watch))
      .pipe(bundle.stream())
      .pipe(gulpRename({
        basename: config('dist.name')
      }))
      .pipe(gulp.dest(config('dist.destination')));
  },

  // Currently this gets executed just before the previous one finishes because
  // there's a bug in Galvatron's watch utility that tries to fix the problem
  // with EVERY Gulp watch stream ever made: Being able to fire something when
  // the initial pass of the files is complete. Events only fire on data and
  // when the stream is ended, but not when it's complete but still watching.
  function () {
    var bundle = galvatron.bundle(path.join(config('dist.destination'), config('dist.name')) + '.js');
    return gulp.src(bundle.files)
      .pipe(gulpUglify())
      .pipe(gulpRename({
        suffix: config('dist.minSuffix')
      }))
      .pipe(gulp.dest(config('dist.destination')));
  }
);
