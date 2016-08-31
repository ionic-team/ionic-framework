import { COMMONJS_MODULE, DIST_E2E_ROOT, SCRIPTS_ROOT, SRC_ROOT } from '../constants';
import {dest, src, task} from 'gulp';
import * as path from 'path';
import * as fs from 'fs';

import { compileSass, copyFonts, createTempTsConfig, deleteFiles, runNgc, runWebpack } from '../util';

export const E2E_BUILD_TASK = 'e2e';
export const E2E_COPY_SOURCE_TASK = 'e2e.copySource';
export const E2E_COMPILE_TESTS = 'e2e.compileTests';
export const E2E_COPY_EXTERNAL_DEPENDENCIES = 'e2e.copyExternalDependencies';
export const E2E_COMPILE_SASS = 'e2e.sass';
export const E2E_COPY_FONTS = 'e2e.fonts';
export const E2E_BEFORE_WEBPACK = 'e2e.beforeWebpack';
export const E2E_RUN_WEBPACK = 'e2e.runWebpack';

task(E2E_BUILD_TASK, (done: Function) => {
  const runSequence = require('run-sequence');
  runSequence(E2E_COPY_SOURCE_TASK, E2E_COMPILE_TESTS, E2E_COPY_EXTERNAL_DEPENDENCIES, E2E_COMPILE_SASS, E2E_COPY_FONTS, E2E_BEFORE_WEBPACK, E2E_RUN_WEBPACK, done);
});

task(E2E_COPY_SOURCE_TASK, (done: Function) => {
  const gulpif = require('gulp-if');
  const _ = require('lodash');
  const VinylFile = require('vinyl');
  const through2 = require('through2');
  const buildConfig = require('../../build/config');

  const stream = src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/**/*.spec.ts`])
    .pipe(gulpif(/app-module.ts$/, createIndexHTML()))
    .pipe(gulpif(/e2e.ts$/, createPlatformTests()))
    .pipe(dest(DIST_E2E_ROOT));

  stream.on('end', done);

  function createIndexHTML() {
    const indexTemplate = fs.readFileSync('scripts/e2e/index.html');
    const indexTs = fs.readFileSync('scripts/e2e/entry.ts');

    return through2.obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTs),
        path: path.join(path.dirname(file.path), 'entry.ts'),
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

    let testTemplate = _.template(fs.readFileSync('scripts/e2e/e2e.template.js'));

    return through2.obj(function(file, enc, next) {
      let self = this;
      let relativePath = path.dirname(file.path.replace(/^.*?src(\/|\\)components(\/|\\)/, ''));

      let contents = file.contents.toString();
      platforms.forEach(function(platform) {
        let platformContents = testTemplate({
          contents: contents,
          buildConfig: buildConfig,
          relativePath: relativePath,
          platform: platform
        });
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(platformContents),
          path: file.path.replace(/e2e.ts$/, platform + '.e2e.js')
        }));
      });
      next();
    });
  }
});

task(E2E_COMPILE_TESTS, (done: Function) => {
  buildE2ETests(done);
});

function buildE2ETests(done: Function) {
  createTempTsConfig(['./components/*/test/*/app-module.ts', './components/*/test/*/entry.ts'], COMMONJS_MODULE, `${DIST_E2E_ROOT}/tsconfig.json`);
  runNgc(`${DIST_E2E_ROOT}/tsconfig.json`, (err) => {
    if (err) {
      done(err);
      return;
    }
    // clean up any .ts files that remain
    deleteFiles([`${DIST_E2E_ROOT}/**/*.ts`, `!${DIST_E2E_ROOT}/**/*.ngfactory.ts`, `!${DIST_E2E_ROOT}/**/*.d.ts`], done);
  });
}

task(E2E_COPY_EXTERNAL_DEPENDENCIES, () => {
  src([`${SCRIPTS_ROOT}/e2e/*.css`]).pipe(dest(`${DIST_E2E_ROOT}/css`));
});

task(E2E_COMPILE_SASS, () => {
  return compileSass(`${DIST_E2E_ROOT}/css`);
});

task(E2E_COPY_FONTS, () => {
  return copyFonts(`${DIST_E2E_ROOT}/fonts`);
});

task(E2E_BEFORE_WEBPACK, function(done) {
  /**
   * Find all AppModule.ts files because the act as the entry points
   * for each e2e test.
   */
  let glob = require('glob');
  glob(`${DIST_E2E_ROOT}/components/*/test/*/app-module.js`, {}, function(er, files) {
    var directories = files.map(function(file) {
      return path.dirname(file);
    });

    var webpackEntryPoints = directories.reduce(function(endObj, dir) {
      let relativePath = dir.replace(process.cwd() + '/', './');
      endObj[relativePath + '/index'] = relativePath + '/entry';
      return endObj;
    }, {});

    let indexFileContents = directories.map(function(dir) {
      return '<p><a href="./' + dir + '/index.html">' + dir + '</a></p>';
    }, []);

    fs.writeFileSync('./scripts/e2e/webpackEntryPoints.json', JSON.stringify(webpackEntryPoints, null, 2));
    fs.writeFileSync(`${DIST_E2E_ROOT}/index.html`,
      '<!DOCTYPE html><html lang="en"><head></head><body style="width: 500px; margin: 100px auto">\n' +
      indexFileContents.join('\n') +
      '</center></body></html>'
    );
    done();
  });
});

task(E2E_RUN_WEBPACK, (done: Function) => {
  const webpackConfigPath = `${SCRIPTS_ROOT}/e2e/webpack.config.js`;
  runWebpack(webpackConfigPath, done);
});
