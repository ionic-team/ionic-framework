import { accessSync, F_OK, readFileSync, writeFileSync } from 'fs';
// import { dirname, join } from 'path';

// import * as glob from 'glob';
import { dest, src, start, task } from 'gulp';
import * as babel from 'gulp-babel';
import * as cache from 'gulp-cached';
import * as concat from 'gulp-concat';
import * as connect from 'gulp-connect';
import * as gulpif from 'gulp-if';
import * as remember from 'gulp-remember';
import * as rename from 'gulp-rename';
import * as tsc from 'gulp-typescript';
import * as watch from 'gulp-watch';
import { template } from 'lodash';
import * as merge from 'merge2';
import * as path from 'path';
import * as del from 'del';
// import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';
// import { argv } from 'yargs';

import { DIST_E2E_COMPONENTS_ROOT, DIST_E2E_ROOT, DIST_NAME, E2E_NAME, ES5, ES_2015, LOCAL_SERVER_PORT, PROJECT_ROOT, SCRIPTS_ROOT, SRC_COMPONENTS_ROOT, SRC_ROOT } from '../constants';
import { compileSass, copyFonts, createTempTsConfig, createTimestamp, deleteFiles, runNgc, setSassIonicVersion, writePolyfills } from '../util';

const buildConfig = require('../../build/config');

/**
 * Builds Ionic e2e tests to dist/e2e and creates the necessary files for tests
 * to run.
 */
task('e2e', [
  // 'e2e.clean',
  'e2e.build',
  'e2e.polyfill',
  'e2e.copyExternalDependencies',
  'e2e.sass',
  'e2e.fonts',
  'e2e.bundle'
]);

    // 'e2e.copySource',
    // 'e2e.compileTests',

task('e2e.clean', (done: Function) => {
  del([`${DIST_E2E_ROOT}/**`]).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

/**
 * Builds e2e tests to dist/e2e and watches for changes.  Runs 'e2e.bundle' or
 * 'sass' on Ionic source changes and 'e2e.build' for e2e test changes.
 */
task('e2e.watch', ['e2e'], function() {
  watchTask('e2e.bundle');

  watch('src/components/*/test/**/*', function(file) {
    start('e2e.build');
  });
});

function watchTask(task) {
  watch([
      'src/**/*.ts',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ],
    function(file) {
      if (file.event !== 'unlink') {
        start(task);
      }
    }
  );

  watch('src/**/*.scss', function() {
    start('sass');
  });

  start('e2e.serve');
}

task('e2e.serve', function() {
  connect.server({
    root: './',
    port: LOCAL_SERVER_PORT,
    livereload: {
      port: 35700
    }
  });
});

/**
 * Creates SystemJS bundle from Ionic source files.
 */
task('e2e.bundle', function(){
  var tsResult = tsCompile(getTscOptions('es6'), 'system')
    .pipe(babel(babelOptions));

  var swiper = src('src/components/slides/swiper-widget.system.js');

  return merge([tsResult, swiper])
    .pipe(remember('system'))
    .pipe(concat('ionic.system.js'))
    .pipe(dest('dist/bundles'))
    .pipe(connect.reload());
});

function tsCompile(options, cacheName) {
  return src([
      'typings/main.d.ts',
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/components/*/test/**/*',
      '!src/util/test/*',
      '!src/config/test/*',
      '!src/platform/test/*',
      '!src/**/*.spec.ts'
    ])
    .pipe(cache(cacheName, { optimizeMemory: true }))
    .pipe(tsc(options, undefined, tscReporter));
}

function getTscOptions(name?: string) {
  var opts = {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    target: 'es5',
    module: 'commonjs',
    isolatedModules: true,
    typescript: require('typescript'),
    declaration: false
  };

  if (name === 'typecheck') {
    opts.declaration = true;
    delete opts.isolatedModules;
  } else if (name === 'es6') {
    opts.target = 'es6';
    delete opts.module;
  }
  return opts;
}

var tscReporter = {
  error: function (error) {
    // TODO
    // suppress type errors until we convert everything to TS
    // console.error(error.message);
  }
};

// We use Babel to easily create named System.register modules
// See: https://github.com/Microsoft/TypeScript/issues/4801
// and https://github.com/ivogabe/gulp-typescript/issues/211
const babelOptions = {
  moduleIds: true,
  getModuleId: function(name) {
    return 'ionic-angular/' + name;
  },
  plugins: ['transform-es2015-modules-systemjs'],
  presets: ['es2015']
};

/**
 * Builds Ionic e2e tests to dist/e2e.
 */
task('e2e.build', function() {
  var indexTemplate = template(
   readFileSync('scripts/e2e/e2e.template.html').toString()
  )({
    buildConfig: buildConfig
  });
  var testTemplate = template(readFileSync('scripts/e2e/e2e.template.js').toString());

  var platforms = [
    'android',
    'ios',
    'windows'
  ];

  // Get each test folder with src
  var tsResult = src([
      'src/components/*/test/*/**/*.ts',
      '!src/components/*/test/*/**/*.spec.ts'
    ])
    .pipe(cache('e2e.ts'))
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .on('error', function(error) {
      console.log(error.message);
    })
    .pipe(gulpif(/app-module.js$/, createIndexHTML()))
    .pipe(gulpif(/e2e.js$/, createPlatformTests()));

  var testFiles = src([
      'src/components/*/test/*/**/*',
      '!src/components/*/test/*/**/*.ts'
    ])
    .pipe(cache('e2e.files'));

  return merge([
      tsResult,
      testFiles
    ])
    .pipe(rename(function(file) {
      var sep = path.sep;
      file.dirname = file.dirname.replace(sep + 'test' + sep, sep);
    }))
    .pipe(dest(DIST_E2E_ROOT))
    .pipe(connect.reload());

  function createIndexHTML() {
    return obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }

  function createPlatformTests(file?: any) {
    return obj(function(file, enc, next) {
      var self = this;
      var relativePath = path.dirname(file.path.replace(/^.*?ionic(\/|\\)components(\/|\\)/, ''));
      relativePath = relativePath.replace('/test/', '/');
      var contents = file.contents.toString();
      platforms.forEach(function(platform) {
        var platformContents = testTemplate({
          contents: contents,
          buildConfig: buildConfig,
          relativePath: relativePath,
          platform: platform
        });
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(platformContents),
          path: file.path.replace(/e2e.js$/, platform + '.e2e.js')
        }));
      });
      next();
    });
  }
});

task('e2e.copyExternalDependencies', () => {
  src([`${SCRIPTS_ROOT}/e2e/*.css`]).pipe(dest(`${DIST_E2E_ROOT}/css`));
});

task('e2e.sass', () => {
  // ensure there is a version.scss file
  setSassIonicVersion(`E2E-${createTimestamp()}`);
  return compileSass(`${DIST_E2E_ROOT}/css`);
});

task('e2e.fonts', () => {
  return copyFonts(`${DIST_E2E_ROOT}/fonts`);
});

task('e2e.polyfill', (done: Function) => {
  writePolyfills(`${DIST_E2E_ROOT}/polyfills`).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});
