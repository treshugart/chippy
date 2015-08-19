'use strict';

var commander = require('../lib/commander');
var config = require('../lib/config');
var galvatron = require('galvatron')('perf');
var gulp = require('gulp');
var karma = require('karma').server;
var mac = require('mac');
var path = require('path');

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .option('-h, --host [localhost]', 'The host to listen on.')
  .option('-p, --port [9876]', 'The port to listen on.')
  .parse(process.argv);

var browsers = commander.browsers || config('test.browsers').join(',');
var clientArgs = [];
var entryMain = config('test.main');
var includeFiles = config('test.files');

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
    browserNoActivityTimeout: 1000000,
    singleRun: !commander.watch,
    hostname: commander.host || config('test.server.host'),
    port: commander.port || config('test.server.port'),
    frameworks: config('test.server.frameworks'),
    browsers: browsers.split(','),
    client: {
      args: clientArgs
    },
    files: includeFiles.concat([path.join(config('tmp'), path.basename(entryMain))])
  });
}

module.exports = mac.series(
  function () {
    var bundle = galvatron.bundle(entryMain);
    return gulp.src(bundle.files)
      .pipe(bundle.watchIf(commander.watch))
      .pipe(bundle.stream())
      .pipe(gulp.dest(config('tmp')));
  },
  run
);
