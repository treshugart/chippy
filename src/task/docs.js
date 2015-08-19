var cmd = require('../lib/commander');
var del = require('del');
var galvatron = require('galvatron');
var gulp = require('gulp');
var gulpLess = require('gulp-less');
var gulpWebserver = require('gulp-webserver');
var mac = require('../lib/mac');
var metalsmith = require('metalsmith');
var metalsmithMarkdown = require('metalsmith-markdown');
var metalsmithTemplates = require('metalsmith-templates');
var metalsmithWatch = require('metalsmith-watch');

module.exports = mac.series(
  function (done) {
    var ms = metalsmith('docs')
      .use(metalsmithMarkdown({ sanitize: false }))
      .use(metalsmithTemplates('handlebars'));

    if (cmd.watch) {
      ms.use(metalsmithWatch());
    }

    ms.build(function (err) {
      if (err) { throw err; }
      done();
    });
  },

  function (done) {
    del('docs/build/styles', done);
  },

  function () {
    var bundle = galvatron().bundle('docs/src/styles/index.less');
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(cmd.watch))
      .pipe(gulpLess())
      .pipe(gulp.dest('docs/build/styles'));
  },

  function () {
    var galv = galvatron();
    galv.transformer.post('babel').post('globalize');
    var bundle = galv.bundle('docs/src/scripts/index.js');
    return gulp
      .src(bundle.files)
      .pipe(bundle.watchIf(cmd.watch))
      .pipe(bundle.stream())
      .pipe(gulp.dest('docs/build/scripts'));
  },

  function () {
    if (!cmd.watch) {
      return;
    }

    return gulp.src('docs/build')
        .pipe(gulpWebserver({
            host: cmd.host || '0.0.0.0',
            livereload: true,
            open: '.',
            port: cmd.port || 8000
        }));
  }
);
