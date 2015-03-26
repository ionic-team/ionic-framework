var buildConfig = require('../build/config');

module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../..',

    frameworks: ['jasmine'],

    files: [
      'node_modules/systemjs/dist/system.js',
      'node_modules/es6-module-loader/dist/es6-module-loader.js',
      'node_modules/traceur-runtime/index.js',
      'node_modules/zone.js/zone.js',
      'node_modules/zone.js/long-stack-trace-zone.js',
      'dist/lib/angular2.js',
      'jspm-config.js',
      'scripts/test/test-main.js',
      {pattern: 'src/**/*.spec.js', included: false},
    ],

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


