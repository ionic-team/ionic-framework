import { task } from 'gulp';
import { writePolyfills } from '../util';


task('src.polyfill', (done: Function) => {
  writePolyfills('scripts/polyfill').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});
