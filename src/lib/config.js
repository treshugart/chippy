'use strict';

var fs = require('fs');
var path = require('path');

var cwd = process.cwd();
var configFile = path.join(cwd, '.chippyrc');
var configJson = fs.existsSync(configFile) && JSON.parse(fs.readFileSync(configFile));
var packageFile = path.join(cwd, 'package.json');
var packageJson = fs.existsSync(packageFile) && require(packageFile);
var packageChippyJson = packageJson && packageJson.chippy;

function getValueFromObject (key, obj) {
  return key.split('.').reduce(function (prev, curr) {
    if (prev) {
      return prev[curr];
    }
  }, obj);
}

function cascadeValueFromObjects () {
  var configs = [].slice.call(arguments);
  return function () {
    var keys = [].slice.call(arguments);
    var a, b, val;
    for (a = 0; a < keys.length; a++) {
      for (b = 0; b < configs.length; b++) {
        val = getValueFromObject(keys[a], configs[b]);
        if (val !== undefined) {
          return val;
        }
      }
    }
  };
}

var files = cascadeValueFromObjects(configJson, packageChippyJson, packageJson);

module.exports = cascadeValueFromObjects(configJson, packageChippyJson, packageJson, {
  build: 'build/tasks',
  dist: {
    js: {
      destination: 'dist',
      minSuffix: '.min',
      source: 'src/index.js',
      transformers: {
        babel: {},
        globalize: {}
      }
    },
    less: {
      destination: 'dist',
      minSuffix: '.min',
      source: 'src/index.less',
      transformers: {}
    }
  },
  docs: {
    basepath: 'docs',
    destination: 'build',
    mainHtmlSource: 'index.html',
    mainLessDestination: 'styles',
    mainLessSource: 'index.less',
    mainJsDestination: 'scripts',
    mainJsSource: 'index.js',
    releaseMessage: 'Release documentation.',
    repo: files('name') + '.github.io',
    server: {
      host: '0.0.0.0',
      livereload: true,
      open: '.',
      port: 8000
    },
    source: 'src',
    templateEngine: 'handlebars',
    transformers: {
      babel: {},
      globalize: {}
    }
  },
  lib: {
    js: {
      destination: 'lib',
      source: 'src/index.js',
      transformers: {
        babel: {
          modules: 'umd'
        }
      }
    }
  },
  lint: {
    paths: ['build', 'src', 'test']
  },
  perf: {
    browsers: ['Firefox'],
    files: ['node_modules/benchmark/benchmark.js'],
    frameworks: ['tap'],
    main: 'test/perf.js',
    server: {
      host: '0.0.0.0',
      port: 9876
    },
    transformers: {
      babel: {},
      globalize: {}
    }
  },
  test: {
    browsers: ['Firefox'],
    files: [],
    frameworks: ['tap'],
    main: 'test/unit.js',
    server: {
      host: '0.0.0.0',
      port: 9876
    },
    transformers: {
      babel: {},
      globalize: {}
    }
  },
  tmp: '.tmp'
});
