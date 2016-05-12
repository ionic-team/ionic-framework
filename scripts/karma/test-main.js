jasmine.DEFAULT_TIMEOUT_INTERVAL = 50;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.import('@angular/core/testing').then(function(coreTesting) {
  return System.import('@angular/platform-browser-dynamic/testing').then(function(browserTesting) {
     coreTesting.setBaseTestProviders(
       browserTesting.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
       browserTesting.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
    );
  });
}).then(function() {
  return Promise.all(
    Object.keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(window.file2moduleName)        // Normalize paths to module names.
    .map(function(path) {
      return System.import(path).then(function(module) {
        if (module.hasOwnProperty('run')) {
          module.run();
        } else {
          console.warn('WARNING: Module ' + path + ' does not implement a run() method. No tests run.');
        }
      });
    }))
})
.then(function() {
  __karma__.start();
}, function(error) {
  console.error(error.stack || error);
  __karma__.start();
});

function onlySpecFiles(path) {
  return /\.spec\.js$/.test(path);
}
function file2moduleName(filePath) {
  return filePath.replace(/\\/g, '/')
}
