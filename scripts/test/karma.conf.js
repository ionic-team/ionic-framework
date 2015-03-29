var buildConfig = require('../build/config');

module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../../dist/lib',

    frameworks: ['jasmine'],

    files: buildConfig.scripts.concat([
      {pattern: 'ionic2/**/*.js', included: false},
      '../../scripts/test/test-main.js',
    ]),

    exclude: buildConfig.src.e2e,

    logLevel: 'warn',

    preprocessors: {
      'modules/**/*.js': ['traceur']
    },

    browsers: ['Chrome'],
    port: 9876
  });
};


