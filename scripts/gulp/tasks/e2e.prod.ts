import { accessSync, F_OK, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

import * as glob from 'glob';
import { dest, src, start, task } from 'gulp';
import * as gulpif from 'gulp-if';
import * as watch from 'gulp-watch';
import { template } from 'lodash';
import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonjs from 'rollup-plugin-commonjs';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';
import { argv } from 'yargs';

import { DIST_E2E_COMPONENTS_ROOT, DIST_E2E_ROOT, DIST_NAME, E2E_NAME, ES5, ES_2015, LOCAL_SERVER_PORT, PROJECT_ROOT, SCRIPTS_ROOT, SRC_COMPONENTS_ROOT, SRC_ROOT } from '../constants';
import { createTempTsConfig, deleteFiles, runNgc } from '../util';

task('e2e.prod', e2eBuild);

function e2eBuild(done: (err: any) => void) {
  runSequence(
    'e2e.clean',
    'e2e.polyfill',
    'e2e.copySource',
    'e2e.compileTests',
    'e2e.copyExternalDependencies',
    'e2e.sass',
    'e2e.fonts',
    'e2e.bundleProd',
    done);
}

task('e2e.copySource', (done: Function) => {

  const buildConfig = require('../../build/config');

  const stream = src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/**/*.spec.ts`])
    .pipe(gulpif(/app-module.ts$/, createIndexHTML()))
    .pipe(gulpif(/e2e.ts$/, createPlatformTests()))
    .pipe(dest(DIST_E2E_ROOT));

  stream.on('end', done);

  function createIndexHTML() {
    const indexTemplate = readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/e2e.template.prod.html`);
    const indexTs = readFileSync(`${SCRIPTS_ROOT}/${E2E_NAME}/entry.ts`);

    return obj(function (file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: join(dirname(file.path), 'index.html'),
      }));
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTs),
        path: join(dirname(file.path), 'entry.ts'),
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
  buildE2ETests(folderInfo, done);
});

function buildE2ETests(folderInfo: any, done: Function) {
  let includeGlob = ['./components/*/test/*/app-module.ts', './components/*/test/*/entry.ts'];
  if (folderInfo.componentName && folderInfo.componentTest) {
    includeGlob = [
      `./components/${folderInfo.componentName}/test/${folderInfo.componentTest}/app-module.ts`,
      `./components/${folderInfo.componentName}/test/${folderInfo.componentTest}/entry.ts`,
    ];
  }
  createTempTsConfig(includeGlob, ES5, ES_2015, `${DIST_E2E_ROOT}/tsconfig.json`);
  runNgc(`${DIST_E2E_ROOT}/tsconfig.json`, (err) => {
    if (err) {
      done(err);
      return;
    }
    // clean up any .ts files that remain
    deleteFiles([`${DIST_E2E_ROOT}/**/*.ts`, `!${DIST_E2E_ROOT}/**/*.ngfactory.ts`, `!${DIST_E2E_ROOT}/**/*.d.ts`], done);
  });
}

task('e2e.bundleProd', (done) => {
  let includeGlob = `${DIST_E2E_ROOT}/components/*/test/*/entry.js`;
  let folderInfo = getFolderInfo();
  if (folderInfo.componentName && folderInfo.componentTest) {
    includeGlob = `${DIST_E2E_ROOT}/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/entry.js`;
  }
  glob(includeGlob, {}, function (er, files) {
    var directories = files.map(function (file) {
      return dirname(file);
    });

    let indexFileContents = directories.map(function (dir) {
      let testName = dir.replace(`${DIST_E2E_ROOT}/components/`, '');
      let fileName = dir.replace(`${PROJECT_ROOT}`, '');
      return `<p><a href="${fileName}/index.html">${testName}</a></p>`;
    }, []);

    writeFileSync(`${DIST_E2E_ROOT}/index.html`,
      '<!DOCTYPE html><html lang="en"><head></head><body style="width: 500px; margin: 100px auto">\n' +
      indexFileContents.join('\n') +
      '</center></body></html>'
    );

    createBundles(files).then(() => {
      done();
    }).catch(err => {
      done(err);
    });
  });
});

function createBundles(files: string[]) {
  let start;
  if (!files) {
    return Promise.reject(new Error('list of files is null'));
  } else if (files.length === 0) {
    return Promise.resolve();
  } else {
    const outputFileName = join(dirname(files[0]), 'app.bundle.js');
    start = Date.now();
    return bundle(files[0], outputFileName).then(() => {
      const end = Date.now();
      const seconds = (end - start) / 1000;
      console.log(`Took ${seconds} seconds to process ${files[0]}`);
      const remainingFiles = files.concat();
      remainingFiles.shift();
      return createBundles(remainingFiles);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}

function bundle(inputFile: string, outputFile: string): Promise<any> {
  console.log(`Starting rollup on ${inputFile} ... writing to ${outputFile}`);
  return rollup.rollup({
    entry: inputFile,
    plugins: [
      commonjs(),
      nodeResolve({
        module: true,
        jsnext: true,
        main: true,
        extensions: ['.js']
      })
    ]
  }).then(bundle => {
    return bundle.write({
      format: 'iife',
      dest: outputFile,
    });
  });
}

task('e2e.watchProd', ['e2e.copyExternalDependencies', 'e2e.sass', 'e2e.fonts'], (done: Function) => {
  const folderInfo = getFolderInfo();
  let e2eTestPath = SRC_COMPONENTS_ROOT;

  if (folderInfo.componentName && folderInfo.componentTest) {
    e2eTestPath = join(SRC_COMPONENTS_ROOT, folderInfo.componentName, 'test', folderInfo.componentTest, 'app-module.ts');
  }

  try {
    accessSync(e2eTestPath, F_OK);
  } catch (e) {
    done(new Error(`Could not find e2e test: ${e2eTestPath}`));
    return;
  }

  if (e2eComponentsExists()) {
    // already generated the e2e directory
    e2eWatch(folderInfo.componentName, folderInfo.componentTest);

  } else {
    // generate the e2e directory
    console.log('Generated e2e builds first...');
    e2eBuild(() => {
      e2eWatch(folderInfo.componentName, folderInfo.componentTest);
    });
  }
});

function e2eWatch(componentName: string, componentTest: string) {
  // If any tests change within components then run e2e.resources.
  watch([
    'src/components/*/test/**/*'
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

  console.log(`http://localhost:${LOCAL_SERVER_PORT}/${DIST_NAME}/${E2E_NAME}/components/${componentName}/test/${componentTest}/`);

  start('e2e.serve');
}

function e2eComponentsExists(): boolean {
  try {
    accessSync(DIST_E2E_COMPONENTS_ROOT, F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

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