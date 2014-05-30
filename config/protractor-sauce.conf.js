var _ = require('lodash');
var config = require('./protractor.conf').config;

config.chromeOnly = false;

exports.config = _.merge({}, config, {
  sauceUser: process.env.SAUCE_USER,
  sauceKey: process.env.SAUCE_KEY,

  capabilities: {
    build: process.env.SAUCE_BUILD_ID || 1,
    'tunnel-identifier': process.env.SAUCE_TUNNEL_ID || 0,
    name: 'Ionic!',
    browserName: 'chrome'
  }
});

