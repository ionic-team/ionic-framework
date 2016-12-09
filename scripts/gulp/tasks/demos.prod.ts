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
    'demos.polyfill',
    'demos.copySource',
    'demos.compileTests',
    'demos.copyExternalDependencies',
    'demos.sass',
    'demos.fonts',
    'demos.bundleProd',
    done);
}

task('demos.copySource', (done: Function) => {
  const stream = src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/components/*/test{,/**/*}`, `${DEMOS_SRC_ROOT}/**/*`])
    .pipe(gulpif(/app.module.ts$/, createIndexHTML()))
    .pipe(dest(DIST_DEMOS_ROOT));

  stream.on('end', done);

  function createIndexHTML() {
    const indexTemplate = readFileSync(`${SCRIPTS_ROOT}/${DEMOS_NAME}/demos.template.prod.html`);
    const indexTs = readFileSync(`${SCRIPTS_ROOT}/${DEMOS_NAME}/entry.ts`);

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
});

task('demos.compileTests', (done: Function) => {
  let folderInfo = getFolderInfo();
  buildDemoTests(folderInfo, done);
});

function buildDemoTests(folderInfo: any, done: Function) {
  let includeGlob = ['./*/app.module.ts', './*/entry.ts'];
  if (folderInfo.componentName && folderInfo.componentTest) {
    includeGlob = [
      `./${folderInfo.componentName}/app.module.ts`,
      `./${folderInfo.componentName}/entry.ts`,
    ];
  }

  createTempTsConfig(includeGlob, ES5, ES_2015, `${DIST_DEMOS_ROOT}/tsconfig.json`);
  runNgc(`${DIST_DEMOS_ROOT}/tsconfig.json`, (err) => {
    if (err) {
      done(err);
      return;
    }
    // clean up any .ts files that remain
    deleteFiles([`${DIST_DEMOS_ROOT}/**/*.ts`, `!${DIST_DEMOS_ROOT}/**/*.ngfactory.ts`, `!${DIST_DEMOS_ROOT}/**/*.d.ts`], done);
  });
}

task('demos.bundleProd', (done) => {
  let includeGlob = `${DIST_DEMOS_ROOT}/*/entry.js`;
  let folderInfo = getFolderInfo();
  if (folderInfo.componentName && folderInfo.componentTest) {
    includeGlob = `${DIST_DEMOS_ROOT}/${folderInfo.componentName}/entry.js`;
  }
  glob(includeGlob, {}, function (er, files) {
    var directories = files.map(function (file) {
      return dirname(file);
    });

    let indexFileContents = directories.map(function (dir) {
      let testName = dir.replace(`${DIST_DEMOS_ROOT}/`, '');
      let fileName = dir.replace(`${PROJECT_ROOT}`, '');
      return `<p><a href="${fileName}">${testName}</a></p>`;
    }, []);

    writeFileSync(`${DIST_DEMOS_ROOT}/index.html`,
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

task('demos.watchProd', ['demos.copyExternalDependencies', 'demos.sass', 'demos.fonts'], (done: Function) => {
  const folderInfo = getFolderInfo();
  let demoTestPath = DEMOS_SRC_ROOT;

  if (folderInfo.componentName && folderInfo.componentTest) {
    demoTestPath = join(DEMOS_SRC_ROOT, folderInfo.componentName, 'app.module.ts');
  }

  try {
    accessSync(demoTestPath, F_OK);
  } catch (e) {
    done(new Error(`Could not find demos test: ${demoTestPath}`));
    return;
  }

  if (demosComponentsExists()) {
    // already generated the demos directory
    demosWatch(folderInfo.componentName, folderInfo.componentTest);

  } else {
    // generate the demos directory
    console.log('Generated demos builds first...');
    demosBuild(() => {
      demosWatch(folderInfo.componentName, folderInfo.componentTest);
    });
  }
});

function demosWatch(componentName: string, componentTest: string) {
  // If any tests change within components then run demos.resources.
  watch([
    'demos/src/**/*'
  ],
    function (file) {
      console.log('start demos.resources - ' + JSON.stringify(file.history, null, 2));
      start('demos.copyAndCompile');
    });

  // If any src files change except for tests then transpile only the source ionic files
  watch([
    'src/**/*.ts',
    '!src/components/*/test/**/*',
    '!src/util/test/*'
  ],
    function (file) {
      console.log('start demos.ngcSource - ' + JSON.stringify(file.history, null, 2));
      start('demos.copyAndCompile');
    });

  // If any scss files change then recompile all sass
  watch(['src/**/*.scss'], (file) => {
    console.log('start sass - ' + JSON.stringify(file.history, null, 2));
    start('demos.sass');
  });

  console.log(`http://localhost:${LOCAL_SERVER_PORT}/${DIST_NAME}/${DEMOS_NAME}/${componentName}`);

  start('demos.serve');
}

function demosComponentsExists(): boolean {
  try {
    accessSync(DIST_DEMOS_COMPONENTS_ROOT, F_OK);
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