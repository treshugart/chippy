'use strict';

var cmd = require('../lib/commander');
var config = require('../lib/config');
var del = require('del');
var galvatron = require('../lib/galvatron')('docs');
var gulp = require('gulp');
var gulpLess = require('gulp-less');
var gulpWebserver = require('gulp-webserver');
var mac = require('../lib/mac');
var metalsmith = require('metalsmith');
var metalsmithMarkdown = require('metalsmith-markdown');
var metalsmithTemplates = require('metalsmith-templates');
var metalsmithWatch = require('metalsmith-watch');
var path = require('path');

module.exports = mac.series(
  function (done) {
    var ms = metalsmith(config('docs.source'))
      .destination(config('docs.destination'))
      .use(metalsmithMarkdown({
        sanitize: false
      }))
      .use(metalsmithTemplates(config('docs.templateEngine')));

    if (cmd.watch) {
      ms.use(metalsmithWatch());
    }

    ms.build(function (err) {
      if (err) {
        throw err;
      }
      done();
    });
  },

  function (done) {
    del(config('docs.destination'), done);
  },

  function () {
    var bundle = galvatron.bundle(config('docs.main.less'));
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(cmd.watch))
      .pipe(gulpLess())
      .pipe(gulp.dest(path.dirname(config('docs.main.less'))));
  },

  function () {
    var galv = galvatron();
    var bundle = galv.bundle(config('docs.main.js'));
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(cmd.watch))
      .pipe(bundle.stream())
      .pipe(gulp.dest(path.dirname(config('docs.main.js'))));
  },

  function () {
    if (!cmd.watch) {
      return;
    }

    return gulp.src(config('docs.destination'))
      .pipe(gulpWebserver({
        host: config('docs.server.host'),
        livereload: config('docs.server.livereload'),
        open: config('docs.server.open'),
        port: config('docs.server.port')
      }));
  }
);
