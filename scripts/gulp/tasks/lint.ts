import { task, src } from 'gulp';
import * as scsslint from 'gulp-scss-lint';
import * as tslint from 'gulp-tslint';

// These packages lack of types.
const gulpTransform = require('gulp-transform');

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
    .pipe(defaultVariables())
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

function defaultVariables() {
  return gulpTransform(contents => {
    const defaultExp = /(?!.*?( !default))^\$.*\;(?!.*(scss-lint:disable DefaultRule))/gm;

    let matches;
    while (matches = defaultExp.exec(contents))
      console.warn('Variable', matches[0], 'Is missing !default');

    return contents;
  });
}
