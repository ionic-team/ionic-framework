import { accessSync, F_OK, readFileSync, stat } from 'fs';
import { dirname, join } from 'path';

import { dest, src, start, task } from 'gulp';
import * as gulpif from 'gulp-if';
import * as watch from 'gulp-watch';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';
import * as VinylFile from 'vinyl';

import { DEMOS_SRC_ROOT, DIST_DEMOS_ROOT, DIST_NAME, DEMOS_NAME, ES5, ES_2015, LOCAL_SERVER_PORT, SCRIPTS_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, getFolders, runAppScripts } from '../util';

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
    let folders = getFolders(`./dist/demos/${folderInfo.componentName}`);
    if (folders.length !== 0) {
      folders.forEach(subFolder => {
        let subFolderInfo = {
          componentName: folderInfo.componentName,
          componentTest: subFolder
        };
        buildTest(folderInfo);        
      })      
    }    
  } else {
    buildAllTests(done);  
  }     
  
});

function buildTest(folderInfo: any) {  
  let includeGlob = [`./dist/demos/${folderInfo.componentName}/${folderInfo.componentTest}/*.ts`];
  let pathToWriteFile = `${DIST_DEMOS_ROOT}/${folderInfo.componentName}/${folderInfo.componentTest}/tsconfig.json`;

  createTempTsConfig(includeGlob, ES5, ES_2015, `${DEMOS_SRC_ROOT}/tsconfig.json`, pathToWriteFile);

  let sassConfigPath = 'scripts/demos/sass.config.js';

  let appEntryPoint = `dist/demos/${folderInfo.componentName}/${folderInfo.componentTest}/main.ts`;
  let distDir = `dist/demos/${folderInfo.componentName}/${folderInfo.componentTest}/`;

  return runAppScripts(folderInfo, sassConfigPath, appEntryPoint, distDir);
}

function buildAllTests(done: Function) {
  let folders = getFolders('./dist/demos/');
  let promises: Promise<any>[] = [];

  folders.forEach(folder => {
    stat(`./dist/demos/${folder}`, function(err, stat) {
      if (err == null) {
        let subFolders = getFolders(`./dist/demos/${folder}`);
    
        subFolders.forEach(subFolder => {
          let folderInfo = {
            componentName: folder,
            componentTest: subFolder
          };
          const promise = buildTest(folderInfo);
          promises.push(promise);          
        })
      }        
    });    
  });
}

task('demos.watchProd', (done: Function) => {
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

  if (demosComponentsExists(folderInfo)) {
    // already generated the demos directory
    demosWatch(folderInfo.componentName, folderInfo.componentTest);

  } else {
    // generate the demos directory
    console.log('Generate demo builds first...');
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

  let serverUrl = `http://localhost:${LOCAL_SERVER_PORT}/${DIST_NAME}/${DEMOS_NAME}`;
  if (componentName) {
    serverUrl += `/${componentName}`;
  }

  console.log(serverUrl);

  start('demos.serve');
}

function demosComponentsExists(folderInfo: any): boolean {
  let componentPath = DIST_DEMOS_ROOT;

  if (folderInfo.componentName && folderInfo.componentTest) {
    componentPath += `/${folderInfo.componentName}/build`;
  }

  try {
    accessSync(componentPath, F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
