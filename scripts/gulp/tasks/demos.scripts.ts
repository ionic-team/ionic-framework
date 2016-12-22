// THIS FILE IS A WIP TO GET THE FRAMEWORK WORKING WITH APP-SCRIPTS

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

import { dest, src, task } from 'gulp';
import * as gulpif from 'gulp-if';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

import { DEMOS_SRC_ROOT, DIST_DEMOS_ROOT, DEMOS_NAME, ES5, ES_2015, SCRIPTS_ROOT, SRC_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo } from '../util';

task('demos.prod', demosBuild);

function demosBuild(done: (err: any) => void) {
  runSequence(
    'demos.clean',
    'demos.polyfill',
    'demos.copySource',
    'demos.compileTests',
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

task('demos.compileTests', (done: Function) => {
  let folderInfo = getFolderInfo();
  buildDemoTests(folderInfo, done);
});

function buildDemoTests(folderInfo: any, done: Function) {
  let includeGlob = ['./dist/demos/**/*.ts'];
  let pathToWriteFile = `${DIST_DEMOS_ROOT}/tsconfig.json`;
  if (folderInfo.componentName && folderInfo.componentTest) {
    includeGlob = [
      `./dist/demos/${folderInfo.componentName}/**/*.ts`
    ];
    pathToWriteFile = `${DIST_DEMOS_ROOT}/${folderInfo.componentName}/tsconfig.json`;
  }

  createTempTsConfig(includeGlob, ES5, ES_2015, `${DEMOS_SRC_ROOT}/tsconfig.json`, pathToWriteFile);
  runAppScripts(folderInfo, done);
}

function runAppScripts(folderInfo: any, done: Function) {
  let sassConfigPath = 'scripts/demos/sass.config.js';

  let appEntryPoint = 'dist/demos/action-sheet/main.ts';
  let distDir = 'dist/demos/action-sheet/';

  if (folderInfo.componentName) {
    console.log('Running App Scripts for', folderInfo.componentName);
    appEntryPoint = `dist/demos/${folderInfo.componentName}/main.ts`;
    distDir = `dist/demos/${folderInfo.componentName}/`;
  }

  let tsConfig = distDir + 'tsconfig.json';

  const scriptsCmd = spawn('ionic-app-scripts',
    ['build',
     '--prod',
     '--sass', sassConfigPath,
     '--appEntryPoint', appEntryPoint,
     '--srcDir', distDir,
     '--wwwDir', distDir,
     '--tsconfig', tsConfig
    ]);

  scriptsCmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  scriptsCmd.stderr.on('data', function (data) {
    console.log('npm err: ' + data.toString());
  });

  scriptsCmd.on('close', function() {
    done();
  });
}
