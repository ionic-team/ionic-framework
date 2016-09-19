import { task, src, dest } from 'gulp';
import { writePolyfills } from '../util';
import { MODERN_ENTRIES, ALL_ENTRIES, NG_ENTRIES} from '../constants';


task('polyfill', ['polyfill.modern', 'polyfill.all', 'polyfill.ng', 'polyfill.copy-readme']);

task('polyfill.all', () => {
  writePolyfills(ALL_ENTRIES, 'dist/ionic-angular/polyfills/polyfills.js');
});

task('polyfill.ng', () => {
  writePolyfills(NG_ENTRIES, 'dist/ionic-angular/polyfills/polyfills.ng.js');
});

task('polyfill.modern', (done) => {
  writePolyfills(MODERN_ENTRIES, 'dist/ionic-angular/polyfills/polyfills.modern.js');
});

task('polyfill.copy-readme', (done) => {
  return src('scripts/polyfill/readme.md')
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});
