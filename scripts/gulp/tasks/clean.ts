import { task } from 'gulp';

export const CLEAN_TASK = 'clean';
export const CLEAN_SRC_TASK = 'clean.src';

task(CLEAN_TASK, (done: () => void) => {
  const del = require('del');
  del(['dist/**'], done);
});

task(CLEAN_SRC_TASK, (done: () => void) => {
  const del = require('del');
  del(['src/**/*.js', 'src/**/*.d.ts', '!src/components/slides/swiper-widget.*'], done);
});
