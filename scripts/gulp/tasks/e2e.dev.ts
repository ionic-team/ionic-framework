import { readFileSync } from 'fs';
import { dirname, join } from 'path';

import { dest, src, task } from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';

import { DIST_E2E_ROOT, E2E_NAME, ES_2015, PROJECT_ROOT, SCRIPTS_ROOT, SRC_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, runAppScriptsServe, writePolyfills } from '../util';


import * as gulpif from 'gulp-if';
import { template } from 'lodash';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

task('e2e.prepare', (done: Function) => {
  runSequence('e2e.clean', 'e2e.polyfill', (err: any) => done(err));
});

task('e2e.watch', ['e2e.prepare'], (done: Function) => {
  const folderInfo = getFolderInfo();
  if (!folderInfo || !folderInfo.componentName || !folderInfo.componentTest) {
    done(new Error(`Usage: gulp e2e.watch --folder nav/basic`));
  }
  buildTest(folderInfo).then(() => {
    console.log('Boom city: ');
    done();
  }).catch((err: Error) => {
    console.log('FUCK: ', err.message);
    done(err);
  });
});


function buildTest(folderInfo: any) {

  const ionicAngularDir = join(process.cwd(), 'src');
  const srcTestRoot = join(process.cwd(), 'src', 'components', folderInfo.componentName, 'test', folderInfo.componentTest);
  const distTestRoot = join(process.cwd(), 'dist', 'e2e', 'components', folderInfo.componentName, 'test', folderInfo.componentTest);
  const includeGlob = [ join(srcTestRoot, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'e2e', 'sass.config.js');
  const copyConfigPath = join('scripts', 'e2e', 'copy.config.js');

  const appEntryPoint = join(srcTestRoot, 'main.ts');
  const appNgModulePath = join(srcTestRoot, 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  return runAppScriptsServe(folderInfo, appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath);
}

task('e2e.clean', (done: Function) => {
  del(['dist/e2e/**']).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('e2e.polyfill', (done: Function) => {
  writePolyfills('dist/e2e/polyfills').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('e2e.copySource', (done: Function) => {

  const buildConfig = require('../../build/config');

  const stream = src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/**/*.spec.ts`])
    .pipe(gulpif(/app.module.ts$/, createIndexHTML()))
    .pipe(gulpif(/e2e.ts$/, createPlatformTests()))
    .pipe(dest(DIST_E2E_ROOT));

  stream.on('end', done);

  function createIndexHTML() {
    const indexTemplate = readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/e2e.template.prod.html`);
    const indexTs = readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/main.ts`);

    return obj(function (file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: join(dirname(file.path), 'index.html'),
      }));
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTs),
        path: join(dirname(file.path), 'main.ts'),
      }));
      next(null, file);
    });
  }

  // TODO this is almost the same as dev, diff and combine
  function createPlatformTests() {
    let platforms = [
      'android',
      'ios',
      'windows'
    ];

    let testTemplate = template(readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/e2e.template.js`).toString());

    return obj(function (file, enc, next) {
      let self = this;

      let relativePath = dirname(file.path.replace(/^.*?src(\/|\\)/, ''));

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
          path: file.path.replace(/e2e.ts$/, platform + '.e2e.js')
        }));
      });
      next();
    });
  }
});
