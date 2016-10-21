import { readFileSync } from 'fs';
import { dirname, join, sep } from 'path';

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
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

import { DIST_E2E_ROOT, DIST_NAME, E2E_NAME, ES5, ES_2015, SCRIPTS_ROOT } from '../constants';

const buildConfig = require('../../build/config');

/**
 * Builds Ionic e2e tests to dist/e2e and creates the necessary files for tests
 * to run.
 */
task('e2e', e2eBuild);

function e2eBuild(done: (err: any) => void) {
  runSequence(
    'e2e.clean',
    'e2e.build',
    'e2e.polyfill',
    'e2e.copyExternalDependencies',
    'e2e.sass',
    'e2e.fonts',
    'e2e.bundle',
    done);
}

/**
 * Builds Ionic e2e tests to dist/e2e.
 */
task('e2e.build', function () {
  var indexTemplate = template(
    readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/e2e.template.dev.html`).toString()
  )({
    buildConfig: buildConfig
  });

  // Get each test folder with src
  var tsResult = src([
    'src/components/*/test/*/**/*.ts',
    '!src/components/*/test/*/**/*.spec.ts'
  ])
    .pipe(cache('e2e.ts'))
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .on('error', function (error) {
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
    .pipe(rename(function (file) {
      file.dirname = file.dirname.replace(sep + 'test' + sep, sep);
    }))
    .pipe(dest(DIST_E2E_ROOT))
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

  function createPlatformTests() {
    let platforms = [
      'android',
      'ios',
      'windows'
    ];

    let testTemplate = template(readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/e2e.template.js`).toString());

    return obj(function (file, enc, next) {
      let self = this;

      let relativePath = dirname(file.path.replace(/^.*?src(\/|\\)components(\/|\\)/, ''));
      relativePath = relativePath.replace('/test/', '/');

      let contents = file.contents.toString();
      platforms.forEach(function (platform) {
        let platformContents = testTemplate({
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

/**
 * Creates SystemJS bundle from Ionic source files.
 */
task('e2e.bundle', function () {
  var tsResult = tsCompile(getTscOptions('es6'), 'system')
    .pipe(babel(babelOptions));

  var swiper = src('src/components/slides/swiper-widget.system.js');

  return merge([tsResult, swiper])
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
 * Builds e2e tests to dist/e2e and watches for changes.  Runs 'e2e.bundle' or
 * 'sass' on Ionic source changes and 'e2e.build' for e2e test changes.
 */
task('e2e.watch', ['e2e'], function () {
  watchTask('e2e.bundle');

  watch('src/components/*/test/**/*', function (file) {
    start('e2e.build');
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
    start('e2e.sass');
  });

  start('e2e.serve');
}
