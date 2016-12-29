import { spawnSync } from 'child_process';
import { readdirSync, readFileSync, stat, statSync } from 'fs';
import { dirname, join } from 'path';

import { dest, src, task } from 'gulp';
import * as gulpif from 'gulp-if';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

import { DEMOS_SRC_ROOT, DIST_DEMOS_ROOT, DEMOS_NAME, ES5, ES_2015, SCRIPTS_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo } from '../util';

task('demos.prod', demosBuild);

function demosBuild(done: (err: any) => void) {
  runSequence(
    'demos.copyIonic',
    'demos.clean',
    'demos.polyfill',
    'demos.copySource',
    'demos.copyExternalDependencies',
    'demos.sass',
    'demos.fonts',
    'demos.compileTests',
    done);
}

task('demos.copyIonic', (done: (err: any) => void) => {
  runSequence(
    'compile.release',
    'release.compileSass',
    'release.fonts',
    'release.sass',
    'release.createUmdBundle',
    done);
});

task('demos.copySource', (done: Function) => {
  const stream = src([`${DEMOS_SRC_ROOT}/**/*`])
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

  if (folderInfo.componentName && folderInfo.componentTest) {
    buildTest(folderInfo.componentName);
  } else {
    buildAllTests(done);
  }
});

function buildTest(folderName: string) {
  let includeGlob = [`./dist/demos/${folderName}/*.ts`];
  let pathToWriteFile = `${DIST_DEMOS_ROOT}/${folderName}/tsconfig.json`;

  createTempTsConfig(includeGlob, ES5, ES_2015, `${DEMOS_SRC_ROOT}/tsconfig.json`, pathToWriteFile);
  return runAppScripts(folderName);
}

function buildAllTests(done: Function) {
  let folders = getFolders('./dist/demos/');
  let promises: Promise<any>[] = [];

  folders.forEach(folder => {
    stat(`./dist/demos/${folder}/app.module.ts`, function(err, stat) {
      if (err == null) {
        const promise = buildTest(folder);
        promises.push(promise);
      }
    });
  });

  Promise.all(promises).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
}

function runAppScripts(folderName: string) {
  console.log('Running app scripts with', folderName);

  let sassConfigPath = 'scripts/demos/sass.config.js';

  let appEntryPoint = `dist/demos/${folderName}/main.ts`;
  let distDir = `dist/demos/${folderName}/`;

  let tsConfig = distDir + 'tsconfig.json';

  try {
    const scriptsCmd = spawnSync('ionic-app-scripts',
      ['build',
      '--prod',
      '--sass', sassConfigPath,
      '--appEntryPoint', appEntryPoint,
      '--srcDir', distDir,
      '--wwwDir', distDir,
      '--tsconfig', tsConfig
      ]);

    if (scriptsCmd.status !== 0) {
      return Promise.reject(scriptsCmd.stderr.toString());
    }

    console.log(scriptsCmd.output.toString());
    return Promise.resolve();
  } catch (ex) {
    return Promise.reject(ex);
  }
}

function getFolders(dir) {
  return readdirSync(dir)
    .filter(function(file) {
      return statSync(join(dir, file)).isDirectory();
    });
}
