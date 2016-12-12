import { task, src, dest } from 'gulp';
import { join } from 'path';
import { DIST_E2E_ROOT, DIST_BUILD_ROOT, WORKERS_SRC } from '../constants';

const WORKER_FILES = join(WORKERS_SRC, '**', '*.js');


task('release.workers', (done: Function) => {
  const uglify = require('gulp-uglify');
  const workersDesc = join(DIST_BUILD_ROOT, 'workers');
  return src(WORKER_FILES)
    .pipe(uglify())
    .pipe(dest(workersDesc), done);
});


task('e2e.workers', (done: Function) => {
  const workersDesc = join(DIST_E2E_ROOT, 'workers');
  return src(WORKER_FILES)
    .pipe(dest(workersDesc), done);
});
