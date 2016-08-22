import { DIST_BUILD_ROOT, SRC_ROOT } from '../constants';
import { task } from 'gulp';
import { tsBuildTask } from '../util';


task('build', ['build.ts'], () => [DIST_BUILD_ROOT]);

task('build.ts',
  tsBuildTask(SRC_ROOT, 'index', ['**/AppModule.ts', '**/e2e.ts'])
);

