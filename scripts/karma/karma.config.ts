// This file is named differently than its JS bootstrapper to avoid the ts compiler to overwrite it.

import path = require('path');
import { customLaunchers } from './browser-providers.ts';


export function config(config) {
  config.set({
    basePath: path.join(__dirname, '../..'),
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-coverage'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter')
    ],
    files: [
      {pattern: 'dist/vendor/core-js/client/core.js', included: true, watched: false},
      {pattern: 'dist/vendor/systemjs/dist/system-polyfills.js', included: true, watched: false},
      {pattern: 'dist/vendor/systemjs/dist/system.src.js', included: true, watched: false},
      {pattern: 'dist/vendor/zone.js/dist/zone.js', included: true, watched: false},
      {pattern: 'dist/vendor/zone.js/dist/proxy.js', included: true, watched: false},
      {pattern: 'dist/vendor/zone.js/dist/async-test.js', included: true, watched: false},
      {pattern: 'dist/vendor/zone.js/dist/fake-async-test.js', included: true, watched: false},

      {pattern: 'scripts/karma/system.config.js', included: true, watched: false},

      // paths loaded via module imports
      {pattern: 'dist/**/*.js', included: false, watched: true},

      // paths to support debugging with source maps in dev tools
      {pattern: 'dist/**/*.ts', included: false, watched: false},
      {pattern: 'dist/**/*.js.map', included: false, watched: false}
    ],
    proxies: {},

    customLaunchers: customLaunchers,

    exclude: [
      'dist/e2e/**/*'
    ],
    // Source files that you wanna generate coverage for.
    // Do not include tests or libraries (these files will be instrumented by Istanbul)
    preprocessors: {
      'dist/ionic-angular/umd/**/!(*spec).js': ['coverage'],
      'dist/ionic-angular/**/*.js': ['sourcemap']
    },
    reporters: ['coverage', 'spec'],
    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    sauceLabs: {
      testName: 'ionic',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.48.2',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      }
    },

    browserStack: {
      project: 'ionic',
      startTunnel: false,
      retryLimit: 1,
      timeout: 600,
      pollingTimeout: 20000
    },

    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 240000,
    captureTimeout: 120000,
    browsers: ['Chrome_1024x768'],

  coverageReporter: {
      reporters: [
        {type: 'json', subdir: '.', file: 'coverage-final.json'}
      ]
    },

    singleRun: true
  });

};