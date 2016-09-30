import * as gulp from 'gulp';

gulp.task('default', help);

gulp.task('help', help);

function help() {
  const taskList = Object.keys((gulp as any).tasks)
    .filter(taskName => taskName !== 'default' && taskName !== 'help')
    .sort()
    .map(taskName => taskName = '     ' + taskName);

  console.log(taskList.join('\n'));
}

gulp.task('validate', ['lint', 'test']);
