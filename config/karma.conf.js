var buildConfig = require('./build');

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // Include jQuery only for testing convience (lots of DOM checking for unit tests on directives)
      'http://codeorigin.jquery.com/jquery-1.10.2.min.js',
      'config/lib/js/angular/angular.js',
      'config/lib/js/angular/angular-animate.js',
      'config/lib/js/angular/angular-mocks.js',
      'config/lib/js/angular-ui/angular-ui-router.js'
    ]
    .concat(buildConfig.ionicFiles)
    .concat(buildConfig.angularIonicFiles)
    .concat([
      'test/**/*.js',
      'js/ext/angular/test/**/*.js'
    ]),

    // list of files to exclude
    exclude: [
      'js/ext/angular/test/dom-trace.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome']
  });
};
