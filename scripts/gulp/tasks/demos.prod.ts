import { dirname, join, relative } from 'path';

import * as glob from 'glob';
import { task } from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';
import { argv } from 'yargs';


import { DEMOS_SRC_ROOT, ES_2015, PROJECT_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, runAppScriptsBuild, writePolyfills } from '../util';

import * as pAll from 'p-all';

task('demos.prepare', (done: Function) => {
  runSequence('demos.clean', 'demos.polyfill', 'demos.sass', (err: any) => done(err));
});

task('demos.prod', ['demos.prepare'], (done: Function) => {

  // okay, first find out all of the demos tests to run by finding all of the 'main.ts' files
  filterDemosEntryPoints().then((filePaths: string[]) => {
    console.log(`Compiling ${filePaths.length} Demos ...`);
    return buildDemos(filePaths);
  }).then(() => {
    done();
  }).catch((err: Error) => {
    done(err);
  });
});

function filterDemosEntryPoints() {
  return getDemosEntryPoints().then((entryPoints: string[]) => {
    const folderInfo = getFolderInfo();
    if (folderInfo && folderInfo.componentName) {
      const filtered = entryPoints.filter(entryPoint => {
        return entryPoint.indexOf(folderInfo.componentName) >= 0;
      });
      return filtered;
    }
    return entryPoints;
  });
}

function getDemosEntryPoints() {
  return new Promise((resolve, reject) => {
    const mainGlob = join(DEMOS_SRC_ROOT, '**', 'main.ts');
    glob(mainGlob, (err: Error, matches: string[]) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}


function buildDemos(filePaths: string[]) {
  const functions = filePaths.map(filePath => () => {
    return buildDemo(filePath);
  });
  let concurrentNumber = 2;
  if (argv.concurrency) {
    concurrentNumber = argv.concurrency;
  }
  return pAll(functions, {concurrency: concurrentNumber});
}

function buildDemo(filePath: string) {
  const start = Date.now();
  const ionicAngularDir = join(process.cwd(), 'src');

  const componentDir = dirname(dirname(filePath));
  const relativePathFromComponents = relative(dirname(DEMOS_SRC_ROOT), componentDir);

  const distTestRoot = join(process.cwd(), 'dist', 'demos', relativePathFromComponents);

  const includeGlob = [ join(ionicAngularDir, '**', '*.ts'), join(componentDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'demos', 'sass.config.js');
  const copyConfigPath = join('scripts', 'demos', 'copy.config.js');

  const appEntryPoint = filePath;
  const appNgModulePath = join(dirname(filePath), 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  return runAppScriptsBuild(appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath).then(() => {
    const end = Date.now();
    console.log(`${filePath} took a total of ${(end - start) / 1000} seconds to build`);
  });
}

task('demos.clean', (done: Function) => {
  // this is a super hack, but it works for now
  if (argv.skipClean) {
    return done();
  }

  del(['dist/demos/**']).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('demos.polyfill', (done: Function) => {
  if (argv.skipPolyfill) {
    return done();
  }

  writePolyfills('dist/demos/polyfills').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});
