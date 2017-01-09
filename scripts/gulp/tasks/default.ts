import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';

gulp.task('default', help);

gulp.task('help', help);

function help() {
  const taskList = Object.keys((gulp as any).tasks)
    .filter(taskName => taskName !== 'default' && taskName !== 'help')
    .sort()
    .map(taskName => taskName = '     ' + taskName);

  console.log(taskList.join('\n'));
}

gulp.task('validate', (done: (err: any) => void) => {
  runSequence('clean', ['lint', 'test'], done);
});
