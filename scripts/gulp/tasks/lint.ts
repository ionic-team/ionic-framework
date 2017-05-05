import { task, src } from 'gulp';
import * as scsslint from 'gulp-scss-lint';
import * as tslint from 'gulp-tslint';

task('lint', ['lint.sass', 'lint.ts']);

task('lint.ts', () => {
  return src([
      'src/**/*.ts'
    ]).pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report());
});

task('lint.sass', function() {
  return src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*',
      '!src/themes/normalize.scss',
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});
