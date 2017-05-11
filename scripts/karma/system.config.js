/*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// disable console debugs/errors/warns from printing out
console.debug = () => {};
// console.error = () => {};
console.warn = () => {};

__karma__.loaded = function () {};


var distPath = '/base/dist/';

System.config({
  baseURL: distPath,
  map: {
    '@angular': 'vendor/@angular',
    '@angular/core': 'vendor/@angular/core/bundles/core.umd.js',
    '@angular/common': 'vendor/@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'vendor/@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'vendor/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'vendor/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'vendor/@angular/http/bundles/http.umd.js',
    '@angular/forms': 'vendor/@angular/forms/bundles/forms.umd.js',
    'rxjs': 'vendor/rxjs',
    'ionic-angular': 'ionic-angular/umd'
  },
  packages: {
    'ionic-angular': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'index'
    },
    rxjs: {
      defaultExtension: 'js'
    },
  }
});

var allSpecFiles = Object.keys(window.__karma__.files).filter(isSpecFile).filter(isIonicFile);

Promise.all(
  allSpecFiles.map((moduleName) => {
    return System.import(moduleName).then(function(m) {
      return m;
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
