var buildConfig = require('./build.config');
// An example configuration file.
exports.config = {

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: ['../dist/ionic-demo/nightly/**/*.scenario.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 120000
  },

  baseUrl: 'http://localhost:' + buildConfig.protractorPort,

  //local build: chrome
  chromeOnly: true,
  capabilities: {
    'browserName': 'chrome'
  }
};

