
module.exports = function(config) {
  require('./karma.conf.js')(config);

  config.set({
    sauceLabs: {
      testName: 'ionic',
      username: 'ionic-test',
      accessKey: '59373b3d-1ee5-43b9-8df4-31107bd21e57',
      startConnect: true,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    },
    //Saucelabs mobile emulation (esp android emulator)
    //can be really slow sometimes, we need to give it time to connectk
    captureTimeout: 60 * 1000,
    browserDisconnectTimeout: 60 * 1000,
    browserNoActivityTimeout: 60 * 1000,
    browserDisconnectTolerance: 2,
    transports: ['xhr-polling'],
    browsers: [
      // 'sauce_ios',
      'sauce_safari',
      // 'sauce_android',
      'sauce_chrome',
      'sauce_firefox',
      // 'sauce_ie9',
      // 'sauce_ie10',
      // 'sauce_ie11'
    ],
    customLaunchers: {
      'sauce_ios': {
        base: 'SauceLabs',
        platform: 'OS X 10.9',
        browserName: 'iphone',
        version: '7'
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
        version: '4.0'
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
    },
  });
};
