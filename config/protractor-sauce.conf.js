var config = require('./protractor.conf').config;

config.chromeOnly = false;


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

  sauceUser: process.env.SAUCE_USER,
  sauceKey: process.env.SAUCE_KEY,

  baseUrl: 'http://localhost:8765',

  capabilities: {
    build: process.env.TRAVIS_BUILD_NUMBER,
    'tunnel-identifier': process.env.TRAVIS_BUILD_NUMBER,
    name: 'Ionic!',
    browserName: 'chrome'
  }
};

