// An example configuration file.
exports.config = {

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: ['../test/e2e/**/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 120000
  },

  baseUrl: 'http://localhost:8765',

  //local build: chrome
  chromeOnly: true,
  capabilities: {
    'browserName': 'chrome'
  }
};

