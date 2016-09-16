import { COMMONJS_MODULE, DIST_BUILD_ROOT, DIST_BUILD_COMMONJS_ROOT, ES_MODULE } from '../constants';
import { task } from 'gulp';
import { copySourceToDest, copySwiperToPath, createTempTsConfig, deleteFiles, runNgc} from '../util';


export function buildIonicAngularCommonJs(excludeSpec: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_COMMONJS_ROOT, excludeSpec, true);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig(['./**/*.ts'], COMMONJS_MODULE, `${DIST_BUILD_COMMONJS_ROOT}/tsconfig.json`);
    runNgc(`${DIST_BUILD_COMMONJS_ROOT}/tsconfig.json`, (err) => {
      if (err) {
        done(err);
        return;
      }

      copySwiperToPath(`${DIST_BUILD_COMMONJS_ROOT}/components/slides`, COMMONJS_MODULE);
      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_COMMONJS_ROOT}/**/*.ts`,
                  `${DIST_BUILD_COMMONJS_ROOT}/**/*metadata.json`,
                  `${DIST_BUILD_COMMONJS_ROOT}/node_modules`,
                  `${DIST_BUILD_COMMONJS_ROOT}/tsconfig.json`,
                  `!${DIST_BUILD_COMMONJS_ROOT}/**/*.d.ts`], done);
    });
  });
}

export function buildIonicAngularEsm(done: Function) {
  const stream = copySourceToDest(DIST_BUILD_ROOT, true, true);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig(['./**/*.ts'], ES_MODULE, `${DIST_BUILD_ROOT}/tsconfig.json`);
    runNgc(`${DIST_BUILD_ROOT}/tsconfig.json`, (err) => {
      if (err) {
        done(err);
        return;
      }
      copySwiperToPath(`${DIST_BUILD_ROOT}/components/slides`, ES_MODULE);
      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_ROOT}/**/*.ts`,
                  `${DIST_BUILD_ROOT}/**/*metadata.json`,
                  `${DIST_BUILD_ROOT}/node_modules`,
                  `${DIST_BUILD_ROOT}/tsconfig.json`,
                  `!${DIST_BUILD_ROOT}/**/*.d.ts`], done);
    });
  });
}

/* this task builds out the necessary stuff for karma */
task('compile.karma', (done: Function) => {
  buildIonicAngularCommonJs(false, done);
});

/* this task builds out the ionic-angular (commonjs and esm) directories for release */
task('compile.release', (done: Function) => {
  buildIonicAngularEsm(() => {
    buildIonicAngularCommonJs(true, done);
  });
});
