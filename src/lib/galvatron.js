'use strict';

var config = require('config');
var galvatron = require('galvatron')();

module.exports = function (configKey) {
  var distTransformers = config(configKey + '.transformers');
  Object.keys(distTransformers || {}).forEach(function (name) {
    galvatron.transformer.post(name, distTransformers[name]);
  });
};
