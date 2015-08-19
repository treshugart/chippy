'use strict';

var cmd = require('../lib/commander');
var config = require('../lib/config');
var del = require('del');
var galvatron = require('../lib/galvatron');
var gulp = require('gulp');
var gulpLess = require('gulp-less');
var gulpWebserver = require('gulp-webserver');
var mac = require('mac');
var metalsmith = require('metalsmith');
var metalsmithMarkdown = require('metalsmith-markdown');
var metalsmithTemplates = require('metalsmith-templates');
var metalsmithWatch = require('metalsmith-watch');
var path = require('path');

var docsSource = path.join(config('docs.basepath'), config('docs.source'));
var docsDestiniation = path.join(config('docs.basepath'), config('docs.destination'));

module.exports = mac.series(
  function (done) {
    var ms = metalsmith(config('docs.basepath'))
      .source(config('docs.source'))
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
    del(path.join(docsDestiniation, config('docs.mainLessDestination'), config('docs.mainLessSource')), done);
  },

  function () {
    var galv = galvatron('docs');
    var bundle = galv.bundle(path.join(docsSource, config('docs.mainLessDestination'), config('docs.mainLessSource')));
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(cmd.watch))
      .pipe(gulpLess())
      .pipe(gulp.dest(path.join(docsDestiniation, config('docs.mainLessDestination'))));
  },

  function () {
    var galv = galvatron('docs');
    var bundle = galv.bundle(path.join(docsSource, config('docs.mainJsDestination'), config('docs.mainJsSource')));
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(cmd.watch))
      .pipe(bundle.stream())
      .pipe(gulp.dest(path.join(docsDestiniation, config('docs.mainJsDestination'))));
  },

  function () {
    if (!cmd.watch) {
      return;
    }

    return gulp.src(config('docs.basepath'), config('docs.destination'))
      .pipe(gulpWebserver({
        host: config('docs.server.host'),
        livereload: config('docs.server.livereload'),
        open: config('docs.server.open'),
        port: config('docs.server.port')
      }));
  }
);
