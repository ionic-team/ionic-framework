/*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function () {};


var distPath = '/base/dist/';

System.config({
  baseURL: distPath,
  map: {
      '@angular': 'vendor/@angular',
      'rxjs': 'vendor/rxjs'
  },
  packages: {
    'ionic-angular': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'index'
    },
    'ionic-angular/testing': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'index'
    },
    '@angular/core': { main: 'index' },
    '@angular/common': { main: 'index' },
    '@angular/compiler': { main: 'index' },
    '@angular/http': { main: 'index' },
    '@angular/forms': { main: 'index' },
    '@angular/platform-browser': { main: 'index' },
    '@angular/platform-browser-dynamic': { main: 'index' },
    'rxjs': { main: 'index' }
  }
});

var allSpecFiles = Object.keys(window.__karma__.files).filter(isSpecFile).filter(isIonicFile);

allSpecFiles = [allSpecFiles[0]];

// allSpecFiles = ['/base/dist/ionic-angular/navigation/test/nav-controller.spec.js'];

// Load and configure the TestComponentBuilder.
Promise.all(
  allSpecFiles.map(function (moduleName) {
    return System.import(moduleName).then(function(module) {
      return module;
    });
  })
).then(__karma__.start, __karma__.error).catch(__karma__.error);



function isJsFile(path) {
  return path.slice(-3) == '.js';
}

function isSpecFile(path) {
  return path.slice(-8) == '.spec.js';
}

function isIonicFile(path) {
  return isJsFile(path) && path.indexOf('vendor') == -1;
}
