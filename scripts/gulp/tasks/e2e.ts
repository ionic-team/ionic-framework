import { DIST_NAME, E2E_NAME, DIST_E2E_ROOT, DIST_E2E_COMPONENTS_ROOT, LOCAL_SERVER_PORT, SCRIPTS_ROOT, SRC_COMPONENTS_ROOT, SRC_ROOT } from '../constants';
import {dest, src, start, task} from 'gulp';
import * as path from 'path';
import * as fs from 'fs';

import { compileSass, copyFonts, execNodeTask } from '../util';


task('e2e', e2eBuild);

function e2eBuild(done: Function) {
  copyExteralE2EFiles();
  let runSequence = require('run-sequence');
  runSequence('e2e.ngcSource', 'e2e.resources', 'e2e.sass', 'e2e.fonts', 'e2e.prewebpack', 'e2e.webpack', done);
}

task('e2e.setupTests', (done: Function) => {
  let gulpif = require('gulp-if');
  let merge = require('merge2');
  let _ = require('lodash');
  let fs = require('fs');
  let VinylFile = require('vinyl');
  const through2 = require('through2');
  const buildConfig = require('../../build/config');

  // Get each test folder with gulp.src
  let tsResult = src([
      'src/components/*/test/*/**/*.ts',
      '!src/components/*/test/*/**/*.spec.ts'
    ])
    .pipe(gulpif(/app-module.ts$/, createIndexHTML()))
    .pipe(gulpif(/e2e.ts$/, createPlatformTests()));

  let testFiles = src([
      'src/components/*/test/*/**/*',
      '!src/components/*/test/*/**/*.ts'
    ]);

  return merge([
      tsResult,
      testFiles
    ])
    .pipe(dest('dist/e2e/tests'));

  function createIndexHTML() {
    let indexTemplate = fs.readFileSync('scripts/e2e/index.html');
    let indexTs = fs.readFileSync('scripts/e2e/entry.ts');

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
      relativePath = relativePath.replace('/dist/e2e/test/', '/');
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

task('e2e.ngcSource', (done: Function) => {
  const fs = require('fs');
  const del = require('del');

  let ngcConfig = require('../../build/commonjsNgcConfig.json');
    ngcConfig.compilerOptions.outDir = '../../dist/e2e';
    ngcConfig.angularCompilerOptions.outDir = '../../dist/e2e';
    ngcConfig.include = [
      `${SRC_ROOT}/index.ts`,
    ];

  fs.writeFileSync('./scripts/build/generated-ngc-config.json', JSON.stringify(ngcConfig, null, 2));

  let startTask = execNodeTask('@angular/compiler-cli', 'ngc', ['-p', './scripts/build/generated-ngc-config.json']);
  startTask( (err: any) => {
    del('./scripts/build/generated-ngc-config.json');
    done(err);
  });
});

task('e2e.resources', ( done: Function) => {
  let runSequence = require('run-sequence');
  runSequence('e2e.setupTests', 'e2e.build.tests', done);
});

function copyExteralE2EFiles() {
  src([`${SCRIPTS_ROOT}/e2e/*.css`]).pipe(dest(`${DIST_E2E_ROOT}/css`));
  src([`${SRC_ROOT}/components/slides/swiper-widget.*`]).pipe(dest(`${DIST_E2E_ROOT}/components/slides`));
}

task('e2e.build.tests',  (done: Function) => {
  const fs = require('fs');
  const del = require('del');

  function updateE2eNgc(componentName?: string, componentTest?: string) {
    let e2eNgc = require('../../e2e/NgcConfig.json');

    // If an e2efolder parameter was passed then only transpile that directory
    if (componentName && componentTest) {
      e2eNgc.include = [
        `${DIST_E2E_ROOT}/tests/${componentName}/test/${componentTest}/app-module.ts`,
        `${DIST_E2E_ROOT}/tests/${componentName}/test/${componentTest}/entry.ts`
      ];
    } else {
      e2eNgc.include = [
        `${DIST_E2E_ROOT}/tests/*/test/*/app-module.ts`,
        `${DIST_E2E_ROOT}/tests/*/test/*/entry.ts`
      ];
    }
    fs.writeFileSync('./.generated-ngc-config.json', JSON.stringify(e2eNgc, null, 2));
  }

  // optionally allow an exact folder to be built instead of all of them
  const argv = require('yargs').argv;
  let componentName: string = null;
  let componentTest: string = null;
  const folder: string = argv.folder || argv.f;
  if (folder && folder.length) {
    const folderSplit = folder.split('/');
    componentName = folderSplit[0];
    componentTest = (folderSplit.length > 1 ? folderSplit[1] : 'basic');
  }

  updateE2eNgc(componentName, componentTest);

  /*let startTask = execNodeTask('@angular/compiler-cli', 'ngc', ['-p', './.generated-ngc-config.json']);
  startTask( (err: any) => {
    del('./.generated-ngc-config.json');
    done(err);
  });
  */
  let exec = require('child_process').exec;
  var shellCommand = 'node --max_old_space_size=8096 ./node_modules/.bin/ngc -p ./.generated-ngc-config.json';

  exec(shellCommand, function(err, stdout, stderr) {
    del('./.generated-ngc-config.json');
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

task('e2e.sass', () => {
  return compileSass(`${DIST_E2E_ROOT}/css`);
});

task('e2e.fonts', () => {
  return copyFonts(`${DIST_E2E_ROOT}/fonts`);
});

/**
 * Task: e2e.prewebpack
 * Dynamically build webpack entryPoints
 * Update index.html file that lists all e2e tasks
 */
task('e2e.prewebpack', function(done) {
  /**
   * Find all AppModule.ts files because the act as the entry points
   * for each e2e test.
   */
  let glob = require('glob');
  glob(`${DIST_E2E_ROOT}/tests/*/test/*/app-module.ts`, {}, function(er, files) {

    var directories = files.map(function(file) {
      return path.dirname(file);
    });

    var webpackEntryPoints = directories.reduce(function(endObj, dir) {
      let relativePath = dir.replace(process.cwd() + '/', './');
      endObj[relativePath + '/index'] = relativePath + '/entry';
      return endObj;
    }, {});

    let indexFileContents = directories.map(function(dir) {
      var fileName = dir.replace(/test\//, '');
      return '<p><a href="./' + fileName + '/index.html">' + fileName + '</a></p>';
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

task('e2e.webpack', function(done) {
  let webpackConfig = './scripts/e2e/webpack.config.js';
  let exec = require('child_process').exec;
  let shellCommand = 'node --max_old_space_size=8096 ./node_modules/.bin/webpack --config ' + webpackConfig + ' --display-error-details';

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

task('e2e.watch', ['e2e.sass', 'e2e.fonts'], (done: Function) => {
  copyExteralE2EFiles();
  const argv = require('yargs').argv;
  const folder: string = argv.folder || argv.f;

  if (!folder || !folder.length) {
    done(new Error('Passing in a folder to watch is required for this command. Use the --folder or -f option.'));
    return;
  }

  const folderSplit = folder.split('/');
  const componentName = folderSplit[0];
  const componentTest = (folderSplit.length > 1 ? folderSplit[1] : 'basic');
  const e2eTestPath = path.join(SRC_COMPONENTS_ROOT, componentName, 'test', componentTest, 'app-module.ts');

  try {
    fs.accessSync(e2eTestPath, fs.F_OK);
  } catch (e) {
    done(new Error(`Could not find e2e test: ${e2eTestPath}`));
    return;
  }

  if (e2eComponentsExists()) {
    // already generated the e2e directory
    e2eWatch(componentName, componentTest);

  } else {
    // generate the e2e directory
    console.log('Generated e2e builds first...');
    e2eBuild(() => {
      e2eWatch(componentName, componentTest);
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
  config.entry[`./dist/e2e/tests/${componentName}/test/${componentTest}/index`] = `./dist/e2e/tests/${componentName}/test/${componentTest}/entry`;

  const compiler = webpack(config);

  // If any tests change within components then run e2e.resources.
  watch([
    'src/components/*/test/**/*'
  ],
  function(file) {
    console.log('start e2e.resources - ' + JSON.stringify(file.history, null, 2));
    start('e2e.resources');
  });

  // If any src files change except for tests then transpile only the source ionic files
  watch([
    'src/**/*.ts',
    '!src/components/*/test/**/*',
    '!src/util/test/*'
  ],
  function(file) {
    console.log('start e2e.ngcSource - ' + JSON.stringify(file.history, null, 2));
    start('e2e.ngcSource');
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
    console.log(`http://localhost:${LOCAL_SERVER_PORT}/${DIST_NAME}/${E2E_NAME}/tests/${componentName}/test/${componentTest}/`);
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
