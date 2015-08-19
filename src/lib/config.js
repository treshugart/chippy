var fs = require('fs');
var cwd = process.cwd();
var configFile = path.join(cwd, '.chippyrc');
var configJson = fs.existsSync(configFile) && require(configFile);
var packageFile = path.join(cwd, 'package.json');
var packageJson = fs.existsSync(packageFile) && require(packageFile);
var defaults = {
  main: 'src/index.js'
};

function config (key) {
  return configJson[key] || packageJson[key] || defaults[key];
}

module.exports = ['main'].map(config);
