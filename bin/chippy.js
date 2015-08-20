#!/usr/bin/env node

'use strict';

var config = require('../src/lib/config');
var fs = require('fs');
var path = require('path');
var sh = require('shelljs');

function scaffoldPath (file) {
  return path.join('node_modules', 'chippy', 'bin', 'scaffolding', file);
}

function mkDefaultDir (dir) {
  if (!fs.existsSync(dir)) {
    sh.mkdir('-p', dir);
  }
}

function mkDefaultFile (file, data) {
  var dir = path.dirname(file);
  mkDefaultDir(dir);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, data || '');
  }
}

function cpDefaultFile (file, dest) {
  mkDefaultFile(dest || file, fs.readFileSync(scaffoldPath(file)));
}

function mkDefaultJson (file, obj) {
  mkDefaultFile('package.json', JSON.stringify(obj, null, '  '));
}

function npmInstallDev (pkg) {
  if (!config('devDependencies.' + pkg)) {
    sh.exec('npm install ' + pkg + ' --save-dev');
  }
}

cpDefaultFile('dot-chippyrc', '.chippyrc');
cpDefaultFile('dot-gitignore', '.gitignore');
cpDefaultFile('dot-jshintrc', '.jshintrc');
cpDefaultFile('dot-jscsrc', '.jscsrc');
cpDefaultFile('gulpfile.js');
cpDefaultFile('LICENSE');
cpDefaultFile('README.md');
mkDefaultDir(config('build'));
mkDefaultDir(config('docs.basepath'));
mkDefaultFile(path.join(config('docs.basepath'), config('docs.source'), config('docs.mainHtmlSource')));
mkDefaultFile(path.join(config('docs.basepath'), config('docs.source'), config('docs.mainJsDestination'), config('docs.mainJsSource')));
mkDefaultFile(path.join(config('docs.basepath'), config('docs.source'), config('docs.mainLessDestination'), config('docs.mainLessSource')));
mkDefaultFile(config('perf.main'));
mkDefaultFile(config('test.main'));
mkDefaultJson('package.json', {
  name: config('name'),
  dependencies: {},
  devDependencies: {},
  peerDependencies: {}
});
npmInstallDev('babel');
npmInstallDev('gulp');
npmInstallDev('gulp-auto-task');
npmInstallDev('jshint');
