
const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox', '--window-size=1920,1080']
  }
};

exports.config = config;
