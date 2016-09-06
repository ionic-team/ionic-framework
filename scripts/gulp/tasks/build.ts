import { COMMONJS_MODULE, DIST_BUILD_ROOT, DIST_BUILD_ESM_ROOT, ES_MODULE } from '../constants';
import { task } from 'gulp';
import { copySourceToDest, copySwiperToPath, createTempTsConfig, deleteFiles, runNgc} from '../util';

export const COMPILE_KARMA_TASK = 'compile.karma';
export const COMPILE_RELEASE_TASK = 'compile.release';

export function buildIonicAngularCommonJs(excludeSpec: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_ROOT, excludeSpec, true);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig(['./**/*.ts'], COMMONJS_MODULE, `${DIST_BUILD_ROOT}/tsconfig.json`);
    runNgc(`${DIST_BUILD_ROOT}/tsconfig.json`, (err) => {
      if (err) {
        done(err);
        return;
      }

      copySwiperToPath(`${DIST_BUILD_ROOT}/components/slides`, COMMONJS_MODULE);
      // clean up any .ts files that remain, as well as unneeded swiper stuff
      deleteFiles([`${DIST_BUILD_ROOT}/**/*.ts`, `!${DIST_BUILD_ROOT}/**/*.ngfactory.ts`, `!${DIST_BUILD_ROOT}/**/*.d.ts`], done);
    });
  });
}

export function buildIonicAngularEsm(done: Function) {
  const stream = copySourceToDest(DIST_BUILD_ESM_ROOT, true, true);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig(['./**/*.ts'], ES_MODULE, `${DIST_BUILD_ESM_ROOT}/tsconfig.json`);
    runNgc(`${DIST_BUILD_ESM_ROOT}/tsconfig.json`, (err) => {
      if (err) {
        done(err);
        return;
      }
      copySwiperToPath(`${DIST_BUILD_ESM_ROOT}/components/slides`, ES_MODULE);
      // clean up any .ts files that remain
      deleteFiles([`${DIST_BUILD_ESM_ROOT}/**/*.ts`, `!${DIST_BUILD_ESM_ROOT}/**/*.ngfactory.ts`, `!${DIST_BUILD_ESM_ROOT}/**/*.d.ts`], done);
    });
  });
}

/* this task builds out the necessary stuff for karma */
task(COMPILE_KARMA_TASK, (done: Function) => {
  buildIonicAngularCommonJs(false, done);
});

/* this task builds out the ionic-angular (commonjs and esm) directories for release */
task(COMPILE_RELEASE_TASK, (done: Function) => {
  buildIonicAngularCommonJs(true, () => {
    buildIonicAngularEsm(done);
  });
});
