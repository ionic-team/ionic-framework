import { task } from 'gulp';
import { join } from 'path';
import { DIST_BUILD_ES2015_ROOT, DIST_BUILD_ROOT, DIST_BUILD_UMD_ROOT, ES5, ES_2015, PROJECT_ROOT, UMD_MODULE } from '../constants';
import { copySourceToDest, createTempTsConfig, deleteFiles, runNgc, runTsc } from '../util';

/* this task builds out the necessary stuff for karma */
task('compile.karma', (done: Function) => {
  buildTS(DIST_BUILD_UMD_ROOT, ES5, UMD_MODULE, done, false, false);
});

/* this task builds out the ionic-angular (commonjs and esm) directories for release */
task('compile.release', (done: Function) => {
  buildTS(DIST_BUILD_ROOT, ES5, ES_2015, () => {
    buildTS(DIST_BUILD_UMD_ROOT, ES5, UMD_MODULE, () => {
      buildTS(DIST_BUILD_ES2015_ROOT, ES_2015, ES_2015, done);
    });
  });
});

function buildTS(buildRoot: string, target: string, moduleFormat: string, done: Function, stripDebug = true, excludeSpec = true) {
  const stream = copySourceToDest(buildRoot, excludeSpec, true, stripDebug);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig([join('.', '**', '*.ts')], target, moduleFormat, join(PROJECT_ROOT, 'tsconfig.json'), join(buildRoot, 'tsconfig.json'));
    runNgc(join(buildRoot, 'tsconfig.json'), err => {
      if (err) {
        done(err);
        return;
      }

      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([
        `${buildRoot}/**/*.ts`,
        `${buildRoot}/node_modules`,
        `${buildRoot}/tsconfig.json`,
        `!${buildRoot}/**/*.d.ts`
      ], done);
    });
  });
}
