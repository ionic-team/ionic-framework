import { DIST_E2E_ROOT, SRC_ROOT } from '../constants';
import {dest, src, task} from 'gulp';
import * as path from 'path';

import { execNodeTask } from '../util';

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
    .pipe(gulpif(/app.ts$/, createIndexHTML()))
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
          path: file.path.replace(/e2e.js$/, platform + '.e2e.js')
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

task('e2e.copy.swiper', () => {
  return src([`${SRC_ROOT}/components/slides/swiper-widget.*`]).pipe(dest(`${DIST_E2E_ROOT}/components/slides`));
});

task('e2e.build.tests',  (done: Function) => {
  const fs = require('fs');
  const del = require('del');

  function updateE2eNgc(e2eFolder: string) {
    let e2eNgc = require('../../e2e/NgcConfig.json');

    // If an e2efolder parameter was passed then only transpile that directory
    if (e2eFolder) {
      e2eNgc.include = [
        `${DIST_E2E_ROOT}/tests/${e2eFolder}/app.ts`,
        `${DIST_E2E_ROOT}/tests/${e2eFolder}/entry.ts`
      ];
    } else {
      e2eNgc.include = [
        `${DIST_E2E_ROOT}/tests/*/test/*/app.ts`,
        `${DIST_E2E_ROOT}/tests/*/test/*/entry.ts`
      ];
    }
    fs.writeFileSync('./.generated-ngc-config.json', JSON.stringify(e2eNgc, null, 2));
  }

  const argv = require('yargs').argv;
  let folder = argv.folder;
  updateE2eNgc(folder);

  let startTask = execNodeTask('@angular/compiler-cli', 'ngc', ['-p', './.generated-ngc-config.json']);
  startTask( (err: any) => {
    del('./.generated-ngc-config.json');
    done(err);
  });
  //let exec = require('child_process').exec;
  //var shellCommand = 'node --max_old_space_size=8096 ./node_modules/.bin/ngc -p ./.generated-ngc-config.json';

  /*exec(shellCommand, function(err, stdout, stderr) {
    del('./.generated-ngc-config.json');
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
  */
});

task('e2e.build', (done: Function) => {
  let runSequence = require('run-sequence');
  runSequence('e2e.ngcSource', 'e2e.setupTests', 'e2e.copy.swiper', 'e2e.build.tests', done);
});