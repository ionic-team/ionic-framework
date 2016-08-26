import { task, src } from 'gulp';


task('lint', ['lint.scss', 'lint.ts']);


task('lint.ts', () => {
  const tslint = require('gulp-tslint');
  return src([
      'src/**/*.ts',
      '!src/**/test/**/*',
    ]).pipe(tslint())
      .pipe(tslint.report('verbose'));
});


task('lint.scss', function() {
  const scsslint = require('gulp-scss-lint');
  return src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});
