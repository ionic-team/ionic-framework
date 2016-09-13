import { task, src } from 'gulp';


task('lint', ['lint.sass', 'lint.ts']);


task('lint.ts', () => {
  const tslint = require('gulp-tslint');
  return src([
      'src/**/*.ts'
    ]).pipe(tslint())
      .pipe(tslint.report('verbose'));
});


task('lint.sass', function() {
  const scsslint = require('gulp-scss-lint');
  return src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});
