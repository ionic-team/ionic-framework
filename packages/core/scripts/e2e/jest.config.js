const path = require('path');

module.exports = {
  rootDir: '../../src/components',
  setupTestFrameworkScriptFile: path.resolve(__dirname, 'setup.js'),
  testRegex: '.+\/test\/.+\/_e2e.js$'
};
