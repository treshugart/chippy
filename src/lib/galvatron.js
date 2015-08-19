'use strict';

var config = require('./config');
var galvatron = require('galvatron');

module.exports = function (configKey) {
  var galv = galvatron();
  var distTransformers = config(configKey + '.transformers');
  Object.keys(distTransformers || {}).forEach(function (name) {
    galv.transformer.post(name, distTransformers[name]);
  });
  galv.reporter.use('progress');
  return galv;
};
