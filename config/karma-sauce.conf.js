var _ = require('lodash');
var shared = require('./karma.conf.js');

module.exports = _.assign({}, shared, {
  reporters: ['dots'],
  sauceLabs: {
    testName: 'Ionic unit tests',
    username: process.env.SAUCE_USER,
    accessKey: process.env.SAUCE_KEY,
    startConnect: false,
    tunnelIdentifier: process.env.SAUCE_TUNNEL_ID || 0
  },
  //Saucelabs mobile emulation (esp android emulator)
  //can be really slow sometimes, we need to give it time to connectk
  captureTimeout: 60 * 1000,
  browserDisconnectTimeout: 60 * 1000,
  browserNoActivityTimeout: 60 * 1000,
  browserDisconnectTolerance: 2,
  browsers: [
    'sauce_ios',
    'sauce_safari',
    // 'sauce_android',
    'sauce_chrome',
    // 'sauce_firefox',
    // 'sauce_ie9',
    // 'sauce_ie10',
    // 'sauce_ie11',
  ],
  customLaunchers: {
    'sauce_ios': {
      base: 'SauceLabs',
      platform: 'OS X 10.9',
      browserName: 'iphone',
      version: '7.1'
    },
    'sauce_safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'sauce_android': {
      base: 'SauceLabs',
      platform: 'Linux',
      browserName: 'android',
      version: '4.3'
    },
    'sauce_chrome': {
      base: 'SauceLabs',
      browserName: 'chrome'
    },
    'sauce_firefox': {
      base: 'SauceLabs',
      platform: 'Linux',
      browserName: 'firefox',
      version: '26'
    }
  }
});
