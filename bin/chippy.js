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

function cpDefaultFile (file) {
  mkDefaultFile(file, fs.readFileSync(scaffoldPath(file)));
}

function mkDefaultJson (file, obj) {
  mkDefaultFile('package.json', JSON.stringify(obj, null, '  '));
}

function npmInstallDev (pkg) {
  if (!config('devDependencies.' + pkg)) {
    sh.exec('npm install ' + pkg + ' --save-dev');
  }
}

cpDefaultFile('.chippyrc');
cpDefaultFile('.gitignore');
cpDefaultFile('.jshintrc');
cpDefaultFile('.jscsrc');
cpDefaultFile('gulpfile.js');
cpDefaultFile('LICENSE');
cpDefaultFile('README.md');
mkDefaultDir(config('build'));
mkDefaultDir(config('docs.source'));
mkDefaultFile(config('dist.source'));
mkDefaultFile(config('docs.main.html'));
mkDefaultFile(config('docs.main.js'));
mkDefaultFile(config('docs.main.less'));
mkDefaultFile(config('lib.source'));
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
