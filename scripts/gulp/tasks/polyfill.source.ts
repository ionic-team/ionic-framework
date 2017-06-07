import { task } from 'gulp';
import { writePolyfills } from '../util';
import { join } from 'path';


task('src.polyfill', (done: Function) => {
  writePolyfills(join('scripts', 'polyfills')).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});
