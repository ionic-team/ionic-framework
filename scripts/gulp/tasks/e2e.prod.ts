import { dirname, join, relative } from 'path';

import { task } from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';

import * as glob from 'glob';

import { ES_2015, PROJECT_ROOT, SRC_COMPONENTS_ROOT } from '../constants';
import { createTempTsConfig, runAppScriptsBuild, writePolyfills } from '../util';

task('e2e.prepare', (done: Function) => {
  runSequence('e2e.clean', 'e2e.polyfill', (err: any) => done(err));
});

task('e2e.prod', ['e2e.prepare'], (done: Function) => {

  // okay, first find out all of the e2e tests to run by finding all of the 'main.ts' files

  getMainTsFiles().then((filePaths: string[]) => {
    return runTests(filePaths);
  }).catch((err: Error) => {
    done(err);
  });
});

function getMainTsFiles() {
  return new Promise((resolve, reject) => {
    const mainGlob = join(SRC_COMPONENTS_ROOT, '*', 'test', '*', 'main.ts');
    glob(mainGlob, (err: Error, matches: string[]) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}

function runTests(filePaths: string[]) {
  // for now, just grab the first two
  return buildTest(filePaths[0]);
}

function buildTest(filePath: string) {

  const ionicAngularDir = join(process.cwd(), 'src');
  const srcTestRoot = dirname(filePath);
  const relativePathFromComponents = relative(dirname(SRC_COMPONENTS_ROOT), srcTestRoot);
  const distTestRoot = join(process.cwd(), 'dist', 'e2e', relativePathFromComponents);

  const includeGlob = [ join(ionicAngularDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'e2e', 'sass.config.js');
  const copyConfigPath = join('scripts', 'e2e', 'copy.config.js');

  const appEntryPoint = join(srcTestRoot, 'main.ts');
  const appNgModulePath = join(srcTestRoot, 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  return runAppScriptsBuild(appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath);
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
