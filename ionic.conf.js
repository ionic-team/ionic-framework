// Karma configuration
// Generated on Wed Sep 04 2013 08:59:26 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // Include jQuery only for testing convience (lots of DOM checking for unit tests on directives)
      'http://codeorigin.jquery.com/jquery-1.10.2.min.js',

      'dist/js/ionic.js',
      'dist/js/angular/angular.js',
      'dist/js/angular/angular-animate.js',
      'dist/js/angular/angular-resource.js',
      'dist/js/angular/angular-mocks.js',
      'dist/js/angular/angular-sanitize.js',
      'dist/js/angular-ui/angular-ui-router.js',
      'dist/js/ionic-angular.js',

      'test/**/*.js',

      'js/ext/angular/test/**/*.js'
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


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
