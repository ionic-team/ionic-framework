import { COMMONJS_MODULE, DIST_E2E_COMPONENTS_ROOT, DIST_E2E_ROOT, DIST_NAME, E2E_NAME, LOCAL_SERVER_PORT, PROJECT_ROOT, SCRIPTS_ROOT, SRC_COMPONENTS_ROOT, SRC_ROOT } from '../constants';
import {dest, src, start, task} from 'gulp';
import * as path from 'path';
import * as fs from 'fs';

import { compileSass, copyFonts, createTempTsConfig, deleteFiles, runNgc, runWebpack, setSassIonicVersion, createTimestamp } from '../util';



task('e2e', e2eBuild);

function e2eBuild(done: Function) {
  const runSequence = require('run-sequence');
  runSequence('polyfills', 'e2e.copySource', 'e2e.compileTests', 'e2e.copyExternalDependencies', 'e2e.sass', 'e2e.fonts', 'e2e.beforeWebpack', 'e2e.runWebpack', done);
}

task('e2e.copyAndCompile', (done: Function) => {
  const runSequence = require('run-sequence');
  runSequence('e2e.copySource', 'e2e.compileTests', 'e2e.beforeWebpack', 'e2e.runWebpack', done);
});

task('e2e.copySource', (done: Function) => {
  const gulpif = require('gulp-if');
  const _ = require('lodash');
  const VinylFile = require('vinyl');
  const through2 = require('through2');
  const buildConfig = require('../../build/config');

  const stream = src([`${SRC_ROOT}/**/*`, `!${SRC_ROOT}/**/*.spec.ts`])
    .pipe(gulpif(/app-module.ts$/, createIndexHTML()))
    .pipe(gulpif(/e2e.ts$/, createPlatformTests()))
    .pipe(dest(DIST_E2E_ROOT));

  stream.on('end', done);

  function createIndexHTML() {
    const indexTemplate = fs.readFileSync('scripts/e2e/index.html');
    const indexTs = fs.readFileSync('scripts/e2e/entry.ts');

    return through2.obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTs),
        path: path.join(path.dirname(file.path), 'entry.ts'),
      }));
      next(null, file);
    });
  }

  function createPlatformTests() {
    let platforms = [
      'android',
      'ios',
      'windows'
    ];

    let testTemplate = _.template(fs.readFileSync('scripts/e2e/e2e.template.js'));

    return through2.obj(function(file, enc, next) {
      let self = this;
      let relativePath = path.dirname(file.path.replace(/^.*?src(\/|\\)components(\/|\\)/, ''));

      let contents = file.contents.toString();
      platforms.forEach(function(platform) {
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
  createTempTsConfig(includeGlob, COMMONJS_MODULE, `${DIST_E2E_ROOT}/tsconfig.json`);
  runNgc(`${DIST_E2E_ROOT}/tsconfig.json`, (err) => {
    if (err) {
      done(err);
      return;
    }
    // clean up any .ts files that remain
    deleteFiles([`${DIST_E2E_ROOT}/**/*.ts`, `!${DIST_E2E_ROOT}/**/*.ngfactory.ts`, `!${DIST_E2E_ROOT}/**/*.d.ts`], done);
  });
}

function getFolderInfo() {
  const argv = require('yargs').argv;
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

task('e2e.copyExternalDependencies', () => {
  src([`${SCRIPTS_ROOT}/e2e/*.css`]).pipe(dest(`${DIST_E2E_ROOT}/css`));
});

task('e2e.sass', () => {
  // ensure there is a version.scss file
  setSassIonicVersion(`E2E-${createTimestamp()}`);
  return compileSass(`${DIST_E2E_ROOT}/css`);
});

task('e2e.fonts', () => {
  return copyFonts(`${DIST_E2E_ROOT}/fonts`);
});

task('e2e.beforeWebpack', (done) => {
  /**
   * Find all AppModule.ts files because the act as the entry points
   * for each e2e test.
   */
  let glob = require('glob');
  let includeGlob = `${DIST_E2E_ROOT}/components/*/test/*/app-module.js`;
  let folderInfo = getFolderInfo();
  if (folderInfo.componentName && folderInfo.componentTest) {
    includeGlob = `${DIST_E2E_ROOT}/components/${folderInfo.componentName}/test/${folderInfo.componentTest}/app-module.js`;
  }
  glob(includeGlob, {}, function(er, files) {
    var directories = files.map(function(file) {
      return path.dirname(file);
    });

    var webpackEntryPoints = directories.reduce(function(endObj, dir) {
      let relativePath = dir.replace(process.cwd() + '/', './');
      endObj[relativePath + '/index'] = relativePath + '/entry';
      return endObj;
    }, {});

    let indexFileContents = directories.map(function(dir) {
      let testName = dir.replace(`${DIST_E2E_ROOT}/components/`, '');
      let fileName = dir.replace(`${PROJECT_ROOT}`, '');
      return `<p><a href="${fileName}/index.html">${testName}</a></p>`;
    }, []);

    fs.writeFileSync('./scripts/e2e/webpackEntryPoints.json', JSON.stringify(webpackEntryPoints, null, 2));
    fs.writeFileSync(`${DIST_E2E_ROOT}/index.html`,
      '<!DOCTYPE html><html lang="en"><head></head><body style="width: 500px; margin: 100px auto">\n' +
      indexFileContents.join('\n') +
      '</center></body></html>'
    );
    done();
  });
});

task('e2e.runWebpack', (done: Function) => {
  const webpackConfigPath = `${SCRIPTS_ROOT}/e2e/webpack.config.js`;
  runWebpack(webpackConfigPath, done);
});


task('e2e.watch', ['e2e.copyExternalDependencies', 'e2e.sass', 'e2e.fonts'], (done: Function) => {
  const folderInfo = getFolderInfo();
  if (! folderInfo.componentName || ! folderInfo.componentTest) {
    done(new Error('Passing in a folder to watch is required for this command. Use the --folder or -f option.'));
    return;
  }

  const e2eTestPath = path.join(SRC_COMPONENTS_ROOT, folderInfo.componentName, 'test', folderInfo.componentTest, 'app-module.ts');

  try {
    fs.accessSync(e2eTestPath, fs.F_OK);
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
  const watch = require('gulp-watch');
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('../../e2e/webpack.config.js');

  config.output.path = path.join(__dirname, '../../../');
  config.entry = {
    'dist/e2e/vendor': './scripts/e2e/vendor',
    'dist-e2e/polyfills': './scripts/e2e/polyfills'
  };
  config.entry[`./dist/e2e/components/${componentName}/test/${componentTest}/index`] = `./dist/e2e/components/${componentName}/test/${componentTest}/entry`;

  const compiler = webpack(config);

  // If any tests change within components then run e2e.resources.
  watch([
    'src/components/*/test/**/*'
  ],
  function(file) {
    console.log('start e2e.resources - ' + JSON.stringify(file.history, null, 2));
    start('e2e.copyAndCompile');
  });

  // If any src files change except for tests then transpile only the source ionic files
  watch([
    'src/**/*.ts',
    '!src/components/*/test/**/*',
    '!src/util/test/*'
  ],
  function(file) {
    console.log('start e2e.ngcSource - ' + JSON.stringify(file.history, null, 2));
    start('e2e.copyAndCompile');
  });

  // If any scss files change then recompile all sass
  watch(['src/**/*.scss'], (file) => {
    console.log('start sass - ' + JSON.stringify(file.history, null, 2));
    start('e2e.sass');
  });

  new WebpackDevServer(compiler, {
    noInfo: true,
    quiet: false,
    watchOptions: {
      aggregateTimeout: 2000,
      poll: 1000
    }
  }).listen(LOCAL_SERVER_PORT, 'localhost', function(err) {
    if (err) {
      throw err;
    }
    console.log(`http://localhost:${LOCAL_SERVER_PORT}/${DIST_NAME}/${E2E_NAME}/components/${componentName}/test/${componentTest}/`);
  });
}

function e2eComponentsExists(): boolean {
  try {
    fs.accessSync(DIST_E2E_COMPONENTS_ROOT, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

