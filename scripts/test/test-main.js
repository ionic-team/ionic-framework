// Use "register" extension from systemjs.
// That's what Traceur outputs: `System.register()`.
register(System);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.baseURL = 'http://localhost:9876/base/dist/';

// So that we can import packages like `core/foo`, instead of `core/src/foo`.
// System.paths = {
//   '*': './*.js',
//   'transpiler/*': '../tools/transpiler/*.js'
// }

Promise.all(
  Object.keys(window.__karma__.files) // All files served by Karma.
  .filter(onlySpecFiles)
  .map(window.file2moduleName)        // Normalize paths to module names.
  .map(function(path) {
    return System.import(path).then(function(module) {
      if (module.hasOwnProperty('main')) {
        module.main();
      } else {
        throw new Error('Module ' + path + ' does not implement main() method.');
      }
    });
  }))
.then(function() {
  __karma__.start();
}, function(error) {
  console.error(error.stack || error);
  __karma__.start();
});

function onlySpecFiles(path) {
  return /_spec\.js$/.test(path);
}
function file2moduleName(filePath) {
  return filePath.replace(/\\/g, '/')
    .replace(/^.*?\/dist\//, '')
    // module name should be relative to `modules` and `tools` folder
    // .replace(/.*\/modules\//, '')
    // .replace(/.*\/tools\//, '')
    // module name should not include `lib`, `web` folders
    // module name should not have a suffix
    // .split('.').pop().join('');
    .replace(/\.\w*$/, '');
}
