var buildConfig = require('../build/config');



module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../../',

    frameworks: ['jasmine'],

    files: [
      'node_modules/es6-shim/es6-shim.min.js',

      'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader.js', //npm2
      'node_modules/es6-module-loader/dist/es6-module-loader.js', //npm3
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/systemjs/dist/system.js',
      'scripts/karma/system.config.js',
      'node_modules/rxjs/bundles/Rx.min.js',
      'dist/bundles/ionic.system.js',
      { pattern: 'node_modules/@angular/**/*.js', included: false},
      { pattern: 'dist/tests/**/*.spec.js', included: false },
      'scripts/karma/test-main.js'
    ],

    exclude: ['ionic/components/*/test/*/**/*'],

    logLevel: 'warn',

    browsers: ['Chrome'],
    port: 9876
  });
};
