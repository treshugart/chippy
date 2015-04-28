'use strict';

var docs = require('../docs');
var mac = require('../lib/mac');
var pkg = require('../../lib/package');
var sh = require('shelljs');

module.exports = mac.series(
  docs,
  function () {
    // Clone docs site repository.
    sh.rm('-rf', '.tmp');
    sh.mkdir('-p', '.tmp');
    sh.cd('.tmp');
    sh.exec('git clone ' + pkg.repository.url + '.github.io .');

    // Remove everything but the .git directory.
    sh.exec('ls -a1 | grep -v "^\\.git$" | grep -v "^\\.$" | grep -v "^\\.\\.$" | xargs rm -rf');

    // Copy the docs into the empty working copy.
    sh.cp('-rf', '../docs/build/*', './');

    // Commit.
    sh.exec('git add .');
    sh.exec('git commit -am "Update documentation."');
    sh.exec('git push');

    // Cleanup.
    sh.cd('..');
    sh.rm('-rf', '.tmp');
  }
);
