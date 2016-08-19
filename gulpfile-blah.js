let gulp = require('gulp');

/* Config values */
const DIST_TEST_PATH = './dist-test';
const TEST_SYSTEM_PATH = `${DIST_TEST_PATH}/system`;
const TEST_ES6_MODULE_PATH = `${DIST_TEST_PATH}/esm`;
const TEST_BUNDLES_PATH = `${DIST_TEST_PATH}/bundles`;
const KARMA_TEST_PATH = `${DIST_TEST_PATH}/karma`;


/* Helper Functions */

function merge(obj1, obj2) {
  let obj3 = {};
  for (let attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (let attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

function getTscOptions() {
  let tsConfig = require('./tsconfig');
  // provide our own version of typescript
  tsConfig.compilerOptions.typescript = require('typescript');

  return tsConfig.compilerOptions;
}

function nativeTypescriptBuild(srcGlob, cacheName, overrideOptions) {
  let tsc = require('gulp-typescript');
  let cache = require('gulp-cached');

  let compilerOptions = getTscOptions();
  if ( ! overrideOptions ) {
    overrideOptions = {};
  }
  let mergedOptions = merge(compilerOptions, overrideOptions);

  return gulp.src(srcGlob)
    .pipe(cache(cacheName, { optimizeMemory: true }))
    .pipe(tsc(mergedOptions));
}

/* Main Functions */
function buildCommonJsTest() {
  let gulpStream = nativeTypescriptBuild(
    ['./src/**/*.ts', '!src/components/*/test/*/*.ts', 'src/**/*.spec.ts'],
    'commonjs',
    {
      module: 'commonjs'
    }
  );
  
  let swiper = gulp.src('./src/components/slides/swiper-widget.js');
  let merge = require('merge2');
  gulpStream = merge([gulpStream, swiper])
  
  return gulpStream.pipe(gulp.dest(DIST_TEST_PATH));
}

function buildSystemJsTest(bundle) {
  let gulpStream = nativeTypescriptBuild(
    ['./src/**/*.ts', '!src/components/*/test/*/*.ts', 'src/**/*.spec.ts'],
    'systemjs',
    {
      module: 'es6'
    }
  );
  
  // We use Babel to easily create named System.register modules
  // See: https://github.com/Microsoft/TypeScript/issues/4801
  // and https://github.com/ivogabe/gulp-typescript/issues/211
  let babelOptions = {
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-systemjs'],
    moduleIds: true,
    getModuleId: function(name) {
      return 'ionic-angular/' + name;
    }
  }
  let babel = require('gulp-babel');
  gulpStream = gulpStream.pipe(babel(babelOptions));

  let swiper = gulp.src('./src/components/slides/swiper-widget.system.js');

  let merge = require('merge2');
  gulpStream = merge([gulpStream, swiper])

  if ( bundle ) {
    let concat = require('gulp-concat');
    return gulpStream.pipe(concat('ionic.system.js')).pipe(gulp.dest(TEST_BUNDLES_PATH));
  } else {
    return gulpStream.pipe(gulp.dest(TEST_SYSTEM_PATH));
  }
}

function buildUnitTests() {
  let path = require('path');
  let rename = require('gulp-rename');
  return nativeTypescriptBuild(
    ['./src/**/test/**/*.spec.ts'],
    'unitTest',
    null
  ).pipe(rename(function(file) {
    let regex = new RegExp(path.sep + 'test(' + path.sep + '|$)');
    file.dirname = file.dirname.replace(regex, path.sep);
  })).pipe(gulp.dest(KARMA_TEST_PATH));
}

function startKarma(watch, doneCallback) {
  let karma = require('karma').server;
  let karmaConfigFile = __dirname + '/scripts/karma/karma.conf.js';
  if ( watch ) {
    karmaConfigFile = __dirname + '/scripts/karma/karma-watch.conf.js';
  }
  karma.start({
    configFile: karmaConfigFile
  }, function(result) {
    if ( result > 0 ) {
      return doneCallback(new Error('Karma exited with an error'));
    }
    return doneCallback();
  }); 
}

function watchUnitTests() {
  let watch = require('gulp-watch');
  watch('src/**/test/**/*.spec.ts', function(){
    gulp.start('build-tests');
  });
}

/* Unit Test (Karma) Tasks */
gulp.task('build-commonjs', function() {
  return buildCommonJsTest();
});

gulp.task('build-systemjs', function() {
  return buildSystemJsTest(false);
});

gulp.task('build-systemjs-bundle', function() {
  return buildSystemJsTest(true);
});


gulp.task('build-es6', function() {
  return buildEs6Test();
});

gulp.task('build-tests', function() {
  return buildUnitTests();
})

gulp.task('build', function(done){
  let runSequence = require('run-sequence');
  runSequence('build-commonjs', 'build-systemjs-bundle', done);
});

gulp.task('clean-test', function(done){
  let del = require('del');
  del([DIST_TEST_PATH], done);
});

gulp.task('karma', ['build-tests'], function(done) {
  startKarma(false, done);
});

gulp.task('watch.tests', ['build-tests'], function(){
  watchUnitTests();
});

