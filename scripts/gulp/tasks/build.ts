import { task } from 'gulp';
import { join } from 'path';
import { DIST_BUILD_ROOT, DIST_BUILD_ES2015_ROOT, DIST_BUILD_UMD_ROOT, ES5, ES_2015, PROJECT_ROOT, UMD_MODULE } from '../constants';
import { copySourceToDest, createTempTsConfig, deleteFiles, runNgc, runTsc } from '../util';


export function buildIonicAngularUmd(excludeSpec: boolean, stripDebug: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_UMD_ROOT, excludeSpec, true, stripDebug);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig([join('.', '**', '*.ts')], ES5, UMD_MODULE, join(PROJECT_ROOT, 'tsconfig.json'), join(DIST_BUILD_UMD_ROOT, 'tsconfig.json'));
    runNgc(join(DIST_BUILD_UMD_ROOT, 'tsconfig.json'), (err) => {
      if (err) {
        done(err);
        return;
      }

      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_UMD_ROOT}/**/*.ts`,
                  `${DIST_BUILD_UMD_ROOT}/node_modules`,
                  `${DIST_BUILD_UMD_ROOT}/tsconfig.json`,
                  `!${DIST_BUILD_UMD_ROOT}/**/*.d.ts`], done);
    });
  });
}

export function buildIonicAngularUmdTsc(excludeSpec: boolean, stripDebug: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_UMD_ROOT, excludeSpec, true, stripDebug);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig([join('.', '**', '*.ts')], ES5, UMD_MODULE, join(PROJECT_ROOT, 'tsconfig.json'), join(DIST_BUILD_UMD_ROOT, 'tsconfig.json'));
    runTsc(join(DIST_BUILD_UMD_ROOT, 'tsconfig.json'), (err) => {
      if (err) {
        done(err);
        return;
      }

      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_UMD_ROOT}/**/*.ts`,
                  `${DIST_BUILD_UMD_ROOT}/node_modules`,
                  `${DIST_BUILD_UMD_ROOT}/tsconfig.json`,
                  `!${DIST_BUILD_UMD_ROOT}/**/*.d.ts`], done);
    });
  });
}


export function buildIonicAngularEsm(stripDebug: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_ROOT, true, true, stripDebug);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig([join('.', '**', '*.ts')], ES5, ES_2015, join(PROJECT_ROOT, 'tsconfig.json'), join(DIST_BUILD_ROOT, 'tsconfig.json'));
    runNgc(join(DIST_BUILD_ROOT, 'tsconfig.json'), (err) => {
      if (err) {
        done(err);
        return;
      }
      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_ROOT}/**/*.ts`,
                  `${DIST_BUILD_ROOT}/node_modules`,
                  `${DIST_BUILD_ROOT}/tsconfig.json`,
                  `!${DIST_BUILD_ROOT}/**/*.d.ts`], done);
    });
  });
}

export function buildIonicPureEs6(stripDebug: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_ES2015_ROOT, true, true, stripDebug);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig([join('.', '**', '*.ts')], ES_2015, ES_2015, join(PROJECT_ROOT, 'tsconfig.json'), join(DIST_BUILD_ES2015_ROOT, 'tsconfig.json'));
    runNgc(join(DIST_BUILD_ES2015_ROOT, 'tsconfig.json'), (err) => {
      if (err) {
        done(err);
        return;
      }
      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_ES2015_ROOT}/**/*.ts`,
                  `${DIST_BUILD_ES2015_ROOT}/node_modules`,
                  `${DIST_BUILD_ES2015_ROOT}/tsconfig.json`,
                  `!${DIST_BUILD_ES2015_ROOT}/**/*.d.ts`], done);
    });
  });
}

/* this task builds out the necessary stuff for karma */
task('compile.karma', (done: Function) => {
  buildIonicAngularUmdTsc(false, false, done);
});

/* this task builds out the ionic-angular (commonjs and esm) directories for release */
task('compile.release', (done: Function) => {
  buildIonicAngularEsm(true, () => {
    buildIonicAngularUmd(true, true, () => {
      buildIonicPureEs6(true, done);
    });
  });
});
