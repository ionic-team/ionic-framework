import { task } from 'gulp';
import { writePolyfills } from '../util';


task('src.polyfill', () => {
  writePolyfills('scripts/polyfill');
});
