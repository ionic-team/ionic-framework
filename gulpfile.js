let gulp = require('gulp');

var cache = require('gulp-cached');

/* Config values */
const DEV_SYSTEM_PATH = './dist/dev/system';
const DEV_COMMONJS_PATH = './dist/dev/commonjs';
const DEV_ES6_MODULE_PATH = './dist/dev/esm';

/* Helper Functions */

function merge(obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

function getTscOptions() {
  let tsConfig = require('./tsconfig');
  console.log(tsConfig.compilerOptions);
  // provide our own version of typescript
  tsConfig.compilerOptions.typescript = require('typescript');

  return tsConfig.compilerOptions;
}

function nativeTypescriptBuild(srcGlob, destDir, cacheName, overrideOptions) {
  let tsc = require('gulp-typescript');

  let compilerOptions = getTscOptions();
  if ( ! overrideOptions ) {
    overrideOptions = {};
  }
  let mergedOptions = merge(compilerOptions, overrideOptions);

  return gulp.src(srcGlob)
    .pipe(cache(cacheName, { optimizeMemory: true }))
    .pipe(tsc(mergedOptions))
    .pipe(gulp.dest(destDir));
}

/* Main Functions */
function buildCommonJsDev(){
  return nativeTypescriptBuild(
    ['./src/**/*.ts', '!src/components/*/test/*/*.ts'],
    DEV_COMMONJS_PATH,
    "commonjs"
  )
}

/* Tasks */
gulp.task('build-commonjs-dev', function(){
  return buildCommonJsDev();
});
