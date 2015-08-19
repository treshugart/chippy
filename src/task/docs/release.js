'use strict';

var config = require('../../lib/config');
var docs = require('../docs');
var mac = require('mac');
var sh = require('shelljs');

var docsReleaseMessage = config('docs.releaseMessage');
var docsRepo = config('docs.repo');
var tmp = config('tmp');

module.exports = mac.series(
  docs,
  function () {
    // Clone docs site repository.
    sh.rm('-rf', tmp);
    sh.mkdir('-p', tmp);
    sh.cd(tmp);
    sh.exec('git clone ' + docsRepo);

    // Remove everything but the .git directory.
    sh.exec('ls -a1 | grep -v "^\\.git$" | grep -v "^\\.$" | grep -v "^\\.\\.$" | xargs rm -rf');

    // Copy the docs into the empty working copy.
    sh.cp('-rf', '../docs/build/*', './');

    // Commit.
    sh.exec('git add .');
    sh.exec('git commit -am "' + docsReleaseMessage + '"');
    sh.exec('git push');

    // Cleanup.
    sh.cd('..');
    sh.rm('-rf', tmp);
  }
);
