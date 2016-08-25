import {task} from 'gulp';
const gulp = require('gulp');


task('default', ['help']);

task('help', function() {
  const taskList = Object.keys(gulp.tasks)
    .filter(taskName => taskName !== 'default')
    .sort();

  console.log(`\nIonic Dev Tasks:\n   `, taskList.join('\n    '));
});
