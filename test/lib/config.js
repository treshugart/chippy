'use strict';

var config = require('../../src/lib/config');
var tape = require('tape');

tape('lib/config', function (t) {
  t.test('should pull values from a .chippyrc file', function (t) {
    t.equal(config('name'), 'chippy');
    t.end();
  });

  t.test('should pull values from a package.json file', function (t) {
    t.equal(config('repository.type'), 'git');
    t.end();
  });

  t.test('should pull values from the defaults', function (t) {
    t.equal(config('tmp'), '.tmp');
    t.end();
  });

  t.test('should allow multiple keys to cascade through', function () {
    t.equal(config('does.not.exist', 'tmp'), '.tmp');
    t.end();
  });
});
