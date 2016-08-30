import { COMMON_JS_NGC_CONFIG, DIST_BUILD_ROOT, DIST_BUILD_ESM_ROOT, ES_MODULES_NGC_CONFIG, SRC_ROOT } from '../constants';
import { task } from 'gulp';
import { copySwiperToPath, tsBuildTask, execNodeTask } from '../util';

const BUILD = 'build';
const COMPILE_TS = 'compile.ts';
const COMPILE_RELEASE = 'compile.release';
const COMPILE_RELEASE_CJS = 'compile.releaseCjs';
const COMPILE_RELEASE_ESM = 'compile.releaseEsm';
const COPY_SWIPER = 'compile.copySwiper';

task(BUILD, [COMPILE_TS], () => [DIST_BUILD_ROOT]);

task(COMPILE_TS, () => {
  let srcGlob = [`${SRC_ROOT}/**/*.ts`, `${SRC_ROOT}/**/*.spec.ts`, `!${SRC_ROOT}/components/*/test/*/*.ts`];
  return tsBuildTask(srcGlob, DIST_BUILD_ROOT);
});

task(COMPILE_RELEASE, (done: Function) => {
  const runSequence = require('run-sequence');
  runSequence(COMPILE_RELEASE_CJS, COMPILE_RELEASE_ESM, COPY_SWIPER, done);
});

task(COMPILE_RELEASE_CJS, execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', COMMON_JS_NGC_CONFIG]
));

task(COMPILE_RELEASE_ESM, execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', ES_MODULES_NGC_CONFIG]
));

task(COPY_SWIPER, () => {
  copySwiperToPath(`${DIST_BUILD_ROOT}/components/slides`);
  copySwiperToPath(`${DIST_BUILD_ESM_ROOT}/components/slides`);
});
