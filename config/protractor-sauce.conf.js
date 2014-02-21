var config = require('./protractor.conf').config;

config.chromeOnly = false;

config.sauceUser = process.env.SAUCE_USER;
config.sauceKey = process.env.SAUCE_KEY;
config.capabilities = {
  build: process.env.TRAVIS_BUILD_NUMBER,
  'tunnel-identifier': process.env.TRAVIS_BUILD_NUMBER,
  name: 'Ionic!',
  browserName: 'chrome'
};

exports.config = config;
