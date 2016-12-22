// THIS FILE IS A WIP TO GET THE FRAMEWORK WORKING WITH APP-SCRIPTS

import { accessSync, F_OK, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

import * as glob from 'glob';
import { dest, src, start, task } from 'gulp';
import * as gulpif from 'gulp-if';
import * as watch from 'gulp-watch';
import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonjs from 'rollup-plugin-commonjs';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';
import { argv } from 'yargs';

import { DEMOS_SRC_ROOT, DIST_DEMOS_COMPONENTS_ROOT, DIST_DEMOS_ROOT, DIST_NAME, DEMOS_NAME, ES5, ES_2015, LOCAL_SERVER_PORT, PROJECT_ROOT, SCRIPTS_ROOT, SRC_COMPONENTS_ROOT, SRC_ROOT } from '../constants';
import { createTempTsConfig, deleteFiles, runNgc } from '../util';

task('demos.prod', demosBuild);

function demosBuild(done: (err: any) => void) {
  runSequence(
    'demos.clean',
    'demos.copySource',
    // 'demos.compileTests',
    done);
}

task('demos.copySource', (done: Function) => {
  const stream = src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/components/*/test{,/**/*}`, `${DEMOS_SRC_ROOT}/**/*`])
    .pipe(gulpif(/app.module.ts$/, createIndexHTML()))
    .pipe(dest(DIST_DEMOS_ROOT));

  stream.on('end', done);

  function createIndexHTML() {
    const indexTemplate = readFileSync(`${SCRIPTS_ROOT}/${DEMOS_NAME}/demos.template.prod.html`);
    const indexTs = readFileSync(`${SCRIPTS_ROOT}/${DEMOS_NAME}/main.ts`);

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
});

// task('demos.compileTests', (done: Function) => {
//   let folderInfo = getFolderInfo();
//   buildDemoTests(folderInfo, done);
// });

// function buildDemoTests(folderInfo: any, done: Function) {
//   let includeGlob = ['./*/app.module.ts', './*/main.ts'];
//   if (folderInfo.componentName && folderInfo.componentTest) {
//     includeGlob = [
//       `./${folderInfo.componentName}/app.module.ts`,
//       `./${folderInfo.componentName}/main.ts`,
//     ];
//   }

//   createTempTsConfig(includeGlob, ES5, ES_2015, `${DIST_DEMOS_ROOT}/tsconfig.json`);
//   runNgc(`${DIST_DEMOS_ROOT}/tsconfig.json`, (err) => {
//     if (err) {
//       done(err);
//       return;
//     }
//     // clean up any .ts files that remain
//     deleteFiles([`${DIST_DEMOS_ROOT}/**/*.ts`, `!${DIST_DEMOS_ROOT}/**/*.ngfactory.ts`, `!${DIST_DEMOS_ROOT}/**/*.d.ts`], done);
//   });
// }

function getFolderInfo() {
  let componentName: string = null;
  let componentTest: string = null;
  const folder: string = argv.folder || argv.f;
  if (folder && folder.length) {
    const folderSplit = folder.split('/');
    componentName = folderSplit[0];
    componentTest = (folderSplit.length > 1 ? folderSplit[1] : 'basic');
  }
  return {
    componentName: componentName,
    componentTest: componentTest
  };
}