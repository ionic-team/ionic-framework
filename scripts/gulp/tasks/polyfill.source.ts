import { task } from 'gulp';
import { writePolyfills } from '../util';
import { MODERN_ENTRIES, ALL_ENTRIES, NG_ENTRIES } from '../constants';


task('polyfill', ['polyfill.modern', 'polyfill.all', 'polyfill.ng', 'polyfill.copy-readme']);

task('polyfill.all', () => {
  writePolyfills(ALL_ENTRIES, 'scripts/polyfill/polyfills.js');
});

task('polyfill.ng', () => {
  writePolyfills(NG_ENTRIES, 'scripts/polyfill/polyfills.ng.js');
});

task('polyfill.modern', (done) => {
  writePolyfills(MODERN_ENTRIES, 'scripts/polyfill/polyfills.modern.js');
});
