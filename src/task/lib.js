'use strict';

var galvatron = require('galvatron')();
var gulp = require('gulp');
var mac = require('mac');

galvatron.transformer.post('babel', {
  modules: 'umd'
});

module.exports = mac.series(
  function (done) {
    del('lib', done);
  },

  function () {
    var bundle = galvatron.bundle('src/index.js');
    return gulp
      .src(bundle.all)
      .pipe(bundle.streamOne())
      .pipe(gulp.dest('lib'));
  }
);
