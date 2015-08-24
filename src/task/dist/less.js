'use strict';

var commander = require('../../lib/commander');
var config = require('../../lib/config');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gulpLess = require('gulp-less');
var gulpWatchLess = require('gulp-watch-less');
var mac = require('mac');
var path = require('path');

module.exports = mac.mac({
  on: 'data end'
}).series(
  function () {
    var dest = config('dist.less.destination');
    var src = config('dist.less.source');
    return gulp.src(src)
      .pipe(gulpIf(!!commander.watch, gulpWatchLess.bind(null, src)))
      .pipe(gulpLess({
        paths: [
          path.basename(src)
        ]
      }))
      .pipe(gulp.dest(dest));
  }
);
