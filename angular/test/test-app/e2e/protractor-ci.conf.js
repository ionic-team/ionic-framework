
// Protractor CI configuration file, see link for more information
// https://angular.io/guide/testing#configure-cli-for-ci-testing-in-chrome

const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox', '--window-size=1920,1080']
  }
};

exports.config = config;
