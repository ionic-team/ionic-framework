var buildConfig = require('../build/config');

module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../..',

    frameworks: ['jasmine'],

    files: [
      // Sources and specs.
      // Loaded through the es6-module-loader, in `test-main.js`.
      {pattern: 'dist/ionic/**/*.js', included: false},
    ]
      .concat(buildConfig.lib)
      .concat('scripts/test/test-main.js'),

    exclude: [
      'src/**/examples/**'
    ],

    logLevel: 'warn',

    preprocessors: {
      'modules/**/*.js': ['traceur']
    },

    browsers: ['Chrome'],
    port: 9876
  });
};


