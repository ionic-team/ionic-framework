import { task } from 'gulp';


task('clean', (done: () => void) => {
  const del = require('del');
  del(['dist/**'], done);
});

task('clean.src', (done: () => void) => {
  const del = require('del');
  del(['src/**/*.js', 'src/**/*.d.ts', '!src/components/slides/swiper-widget.*'], done);
});
