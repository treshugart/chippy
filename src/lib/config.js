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
    destination: 'dist',
    minSuffix: '.min',
    name: files('name') || path.basename(__dirname),
    source: files('main') || 'src/index.js',
    transformers: {
      babel: {},
      globalize: {}
    }
  },
  docs: {
    destination: 'docs/build',
    main: {
      html: 'docs/src/index.html',
      js: 'docs/src/scripts/index.js',
      less: 'docs/src/styles/index.less'
    },
    releaseMessage: 'Release documentation.',
    repo: files('name') + '.github.io',
    server: {
      host: '0.0.0.0',
      livereload: true,
      open: '.',
      port: 8000
    },
    source: 'docs',
    templateEngine: 'handlebars',
    transformers: {
      babel: {},
      globalize: {}
    }
  },
  lib: {
    destination: 'lib',
    source: files('main') || 'src/index.js',
    transformers: {
      babel: {
        modules: 'umd'
      }
    }
  },
  lint: {
    paths: ['build', 'src', 'test']
  },
  perf: {
    browsers: ['Firefox'],
    files: ['node_modules/benchmark/benchmark.js'],
    frameworks: ['tape'],
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
    frameworks: ['tape'],
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
  tmp: '.tmp'
});
