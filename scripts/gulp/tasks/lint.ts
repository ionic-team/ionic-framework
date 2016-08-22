import { task, src } from 'gulp';


task('lint', ['scsslint', 'tslint']);

task('tslint', () => {
  const tslint = require('gulp-tslint');
  return src([
      'src/**/*.ts',
      '!src/**/test/**/*',
    ]).pipe(tslint())
      .pipe(tslint.report('verbose'));
});


task('scsslint', function() {
  const scsslint = require('gulp-scss-lint');
  return src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});
