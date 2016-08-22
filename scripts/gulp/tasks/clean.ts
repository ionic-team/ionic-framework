import { task } from 'gulp';


task('clean', (done: () => void) => {
  const del = require('del');
  del(['dist/**'], done);
});
