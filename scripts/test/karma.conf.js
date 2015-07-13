var buildConfig = require('../build/config');

module.exports = function(config) {
  config.set({
    //singleRun: true,
    basePath: '../../',

    frameworks: ['jasmine'],

    files: buildConfig.scripts.concat([
      'dist/js/es5/ionic/**/*.js',
      'dist/tests/**/*.spec.js',
      'scripts/test/test-main.js'
    ]),

    exclude: buildConfig.src.e2e,

    logLevel: 'warn',

    preprocessors: {
    },

    browsers: ['Chrome'],
    port: 9876
  });
};


