'use strict';

var commander = require('../lib/commander');
var galvatron = require('galvatron')();
var gulp = require('gulp');
var karma = require('karma').server;
var mac = require('../lib/mac');

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .option('-h, --host [localhost]', 'The host to listen on.')
  .option('-p, --port [9876]', 'The port to listen on.')
  .parse(process.argv);

galvatron.transformer
  .post('babel')
  .post('globalize');

var browsers = commander.browsers || 'Firefox';
var clientArgs = [];

if (browsers === 'all') {
  browsers = 'Chrome,Firefox,Opera,Safari';
}

if (commander.grep) {
  clientArgs.push('--grep');
  clientArgs.push(commander.grep);
}

function run () {
  karma.start({
    autoWatch: !!commander.watch,
    singleRun: !commander.watch,
    hostname: commander.host || '0.0.0.0',
    port: commander.port || 9876,
    frameworks: ['mocha', 'sinon-chai'],
    browsers: browsers.split(','),
    client: { args: clientArgs },
    files: [ '.tmp/unit.js' ]
  });
}

module.exports = mac.series(
  function () {
    var bundle = galvatron.bundle('test/unit.js');
    return gulp.src(bundle.files)
      .pipe(bundle.watchIf(commander.watch))
      .pipe(bundle.stream())
      .pipe(gulp.dest('.tmp'));
  },
  run
);
