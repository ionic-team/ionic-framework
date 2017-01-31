import { readFileSync } from 'fs';
import { dirname, join } from 'path';

import { dest, src, start, task } from 'gulp';
import * as babel from 'gulp-babel';
import * as cache from 'gulp-cached';
import * as concat from 'gulp-concat';
import * as connect from 'gulp-connect';
import * as gulpif from 'gulp-if';
import * as remember from 'gulp-remember';
import * as tsc from 'gulp-typescript';
import * as watch from 'gulp-watch';
import { template } from 'lodash';
import * as merge from 'merge2';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

import { DEMOS_NAME, DIST_DEMOS_ROOT, DIST_NAME, ES5, ES_2015, SCRIPTS_ROOT } from '../constants';

const buildConfig = require('../../build/config');

/**
 * Builds Ionic demos tests to dist/demos and creates the necessary files for tests
 * to run.
 */
task('demos', demosBuild);

function demosBuild(done: (err: any) => void) {
  runSequence(
    'demos.clean',
    'demos.build',
    'demos.polyfill',
    'demos.copyExternalDependencies',
    'demos.sass',
    'demos.fonts',
    'demos.bundle',
    done);
}

/**
 * Builds Ionic demos tests to dist/demos.
 */
task('demos.build', function () {
  var indexTemplate = template(
    readFileSync(`${SCRIPTS_ROOT}/${DEMOS_NAME}/demos.template.dev.html`).toString()
  )({
    buildConfig: buildConfig
  });

  // Get each test folder with src
  var tsResult = src([
    'demos/src/*/**/*.ts'
  ])
    .pipe(cache('demos.ts'))
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .on('error', function (error) {
      console.log(error.message);
    })
    .pipe(gulpif(/app.module.js$/, createIndexHTML()));

  var testFiles = src([
    'demos/src/*/**/*',
    '!demos/src/*/**/*.ts'
  ])
    .pipe(cache('demos.files'));

  return merge([
    tsResult,
    testFiles
  ])
    .pipe(dest(DIST_DEMOS_ROOT))
    .pipe(connect.reload());

  function createIndexHTML() {
    return obj(function (file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: join(dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }
});

/**
 * Creates SystemJS bundle from Ionic source files.
 */
task('demos.bundle', function () {
  return tsCompile(getTscOptions('es6'), 'system')
    .pipe(babel(babelOptions))
    .pipe(remember('system'))
    .pipe(concat('ionic.system.js'))
    .pipe(dest(`${DIST_NAME}/bundles`))
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
    target: ES5,
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
    console.error(error.message);
  }
};

// We use Babel to easily create named System.register modules
// See: https://github.com/Microsoft/TypeScript/issues/4801
// and https://github.com/ivogabe/gulp-typescript/issues/211
const babelOptions = {
  moduleIds: true,
  getModuleId: function (name) {
    return 'ionic-angular/' + name;
  },
  plugins: ['transform-es2015-modules-systemjs'],
  presets: [ES_2015]
};

/**
 * Builds demos tests to dist/demos and watches for changes.  Runs 'demos.bundle' or
 * 'sass' on Ionic source changes and 'demos.build' for demos test changes.
 */
task('demos.watch', ['demos'], function () {
  watchTask('demos.bundle');

  watch('demos/src/**/*', function (file) {
    start('demos.build');
  });
});

function watchTask(task) {
  watch([
    'src/**/*.ts',
    '!src/components/*/test/**/*',
    '!src/util/test/*'
  ],
    function (file) {
      if (file.event !== 'unlink') {
        start(task);
      }
    }
  );

  watch('src/**/*.scss', function () {
    start('demos.sass');
  });

  start('demos.serve');
}
