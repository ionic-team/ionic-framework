import { task, src } from 'gulp';
import * as scsslint from 'gulp-scss-lint';
import * as tslint from 'gulp-tslint';
import join from 'path';

task('lint', ['lint.sass', 'lint.ts']);

task('lint.ts', () => {
  return src([
      join('src', '**', '*.ts')
    ]).pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report());
});

task('lint.sass', function() {
  return src([
      join('src', '**', '*.scss'),
      join('!src', 'components', '*', 'test', '**', '*'),
      join('!src', 'util', 'test', '*'),
      join('!src', 'themes', 'normalize.scss')
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});
