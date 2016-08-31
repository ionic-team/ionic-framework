import { task, src } from 'gulp';

export const LINT_TASK = 'lint';
export const TSLINT_TASK = 'lint.ts';
export const SASS_LINT = 'lint.sass';

task(LINT_TASK, [SASS_LINT, TSLINT_TASK]);


task(TSLINT_TASK, () => {
  const tslint = require('gulp-tslint');
  return src([
      'src/**/*.ts'
    ]).pipe(tslint())
      .pipe(tslint.report('verbose'));
});


task(SASS_LINT, function() {
  const scsslint = require('gulp-scss-lint');
  return src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});
