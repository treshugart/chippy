var commander = require('../lib/commander');
var del = require('del');
var galvatron = require('galvatron')();
var gulp = require('gulp');
var mac = require('mac');
var path = require('path');

var cwd = process.cwd();
var src = path.join(cwd, 'src');
var lib = path.join(cwd, 'lib');

galvatron.transformer.post('babel', {
  modules: 'umd'
});

module.exports = mac.series(
  function (done) {
    del(lib, done);
  },

  function () {
    var bundle = galvatron.bundle('src/index.js');

    bundle.all.forEach(function (file) {
      var srcFile = path.relative(src, file);
      var destFile = path.join('lib', srcFile);
      var destDir = path.dirname(destFile);

      gulp
        .src(file)
        .pipe(bundle.watchIf(commander.watch))
        .pipe(bundle.streamOne())
        .pipe(gulp.dest(destDir));
    });
  }
);
