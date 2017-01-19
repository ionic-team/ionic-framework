import { accessSync, F_OK, readFileSync, stat } from 'fs';
import { dirname, join } from 'path';

import { dest, src, start, task } from 'gulp';
import * as gulpif from 'gulp-if';
import * as watch from 'gulp-watch';
import { template } from 'lodash';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

import { DIST_E2E_ROOT, DIST_NAME, E2E_NAME, ES5, ES_2015, LOCAL_SERVER_PORT, DEMOS_SRC_ROOT, SCRIPTS_ROOT, SRC_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, getFolders, runAppScripts} from '../util';

task('e2e.prod', e2eBuild);

function e2eBuild(done: (err: any) => void) {
  runSequence(
    'e2e.copyIonic',
    'e2e.clean',
    'e2e.polyfill',
    'e2e.copySource',
    'e2e.copyExternalDependencies',
    'e2e.sass',
    'e2e.fonts',
    'e2e.compileTests',
    done);
}

task('e2e.copyIonic', (done: (err: any) => void) => {
  runSequence(
    'compile.release',
    'release.compileSass',
    'release.fonts',
    'release.sass',
    'release.createUmdBundle',
    done);
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

task('e2e.compileTests', (done: Function) => {
  let folderInfo = getFolderInfo();

  if (folderInfo.componentName && folderInfo.componentTest) {
    buildTest(folderInfo);
  } else {
    buildAllTests(done);
  }
});

function buildTest(folderInfo: any) {
  let includeGlob = [`./dist/e2e/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/*.ts`];
  let pathToWriteFile = `${DIST_E2E_ROOT}/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/tsconfig.json`;

  createTempTsConfig(includeGlob, ES5, ES_2015, `${DEMOS_SRC_ROOT}/tsconfig.json`, pathToWriteFile);

  let sassConfigPath = 'scripts/e2e/sass.config.js';

  let appEntryPoint = `dist/e2e/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/main.ts`;
  let distDir = `dist/e2e/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/`;

  return runAppScripts(folderInfo, sassConfigPath, appEntryPoint, distDir);
}

function buildAllTests(done: Function) {
  let folders = getFolders('./dist/e2e/components');
  let promises: Promise<any>[] = [];

  folders.forEach(folder => {
    console.log(folder);
    stat(`./dist/e2e/components/${folder}/test`, function(err, stat) {
      if (err == null) {
        let testFolders = getFolders(`./dist/e2e/components/${folder}/test`);

        testFolders.forEach(test => {
          console.log('build test for ', folder, test);
          let folderInfo = {
            componentName: folder,
            componentTest: test
          };
          const promise = buildTest(folderInfo);
          promises.push(promise);
        });
      }
    });
  });

  Promise.all(promises).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
}

task('e2e.watchProd', (done: Function) => {
  const folderInfo = getFolderInfo();
  let e2eTestPath = SRC_ROOT;

  if (folderInfo.componentName && folderInfo.componentTest) {
    e2eTestPath = join(`${SRC_ROOT}/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/app.module.ts`);
  }

  try {
    accessSync(e2eTestPath, F_OK);
  } catch (e) {
    done(new Error(`Could not find e2e test: ${e2eTestPath}`));
    return;
  }

  if (e2eComponentsExists(folderInfo)) {
    // already generated the e2e directory
    e2eWatch(folderInfo.componentName, folderInfo.componentTest);

  } else {
    // generate the e2e directory
    console.log('Generate e2e builds first...');
    e2eBuild(() => {
      e2eWatch(folderInfo.componentName, folderInfo.componentTest);
    });
  }
});

function e2eWatch(componentName: string, componentTest: string) {
  // If any tests change within components then run e2e.resources.
  watch([
    'e2e/src/**/*'
  ],
    function (file) {
      console.log('start e2e.resources - ' + JSON.stringify(file.history, null, 2));
      start('e2e.copyAndCompile');
    });

  // If any src files change except for tests then transpile only the source ionic files
  watch([
    'src/**/*.ts',
    '!src/components/*/test/**/*',
    '!src/util/test/*'
  ],
    function (file) {
      console.log('start e2e.ngcSource - ' + JSON.stringify(file.history, null, 2));
      start('e2e.copyAndCompile');
    });

  // If any scss files change then recompile all sass
  watch(['src/**/*.scss'], (file) => {
    console.log('start sass - ' + JSON.stringify(file.history, null, 2));
    start('e2e.sass');
  });

  let serverUrl = `http://localhost:${LOCAL_SERVER_PORT}/${DIST_NAME}/${E2E_NAME}`;
  if (componentName) {
    serverUrl += `/${componentName}`;
  }

  console.log(serverUrl);

  start('e2e.serve');
}

function e2eComponentsExists(folderInfo: any): boolean {
  let componentPath = `${DIST_E2E_ROOT}/components`;

  if (folderInfo.componentName && folderInfo.componentTest) {
    componentPath += `/${folderInfo.componentName}/test/${folderInfo.componentTest}/build`;
  }

  try {
    accessSync(componentPath, F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
