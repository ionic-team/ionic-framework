import { COMMON_JS_NGC_CONFIG, DIST_BUILD_ROOT, SRC_ROOT } from '../constants';
import { task } from 'gulp';
import { tsBuildTask, execNodeTask } from '../util';


task('build', ['build.ts'], () => [DIST_BUILD_ROOT]);

task('build.ts', () => {
  let srcGlob = [`${SRC_ROOT}/**/*.ts`, `${SRC_ROOT}/**/*.spec.ts`, `!${SRC_ROOT}/components/*/test/*/*.ts`];
  return tsBuildTask(srcGlob, DIST_BUILD_ROOT)
});

task('build.ts.ngc', execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', COMMON_JS_NGC_CONFIG]
));