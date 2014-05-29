var _ = require('lodash');
var config = require('./protractor.conf').config;

config.chromeOnly = false;

exports.config = _.merge({}, config, {
  sauceUser: process.env.SAUCE_USER,
  sauceKey: process.env.SAUCE_KEY,

  capabilities: {
    build: process.env.TRAVIS_BUILD_NUMBER,
    'tunnel-identifier': process.env.TRAVIS_BUILD_NUMBER,
    name: 'Ionic!',
    browserName: 'chrome'
  }
});

