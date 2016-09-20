import { task, src, dest } from 'gulp';
import { writePolyfills } from '../util';

task('polyfill', ['polyfill.copy-readme', 'polyfill.write']);

task('polyfill.write', () => {
  writePolyfills('dist/ionic-angular/polyfills');
});

task('polyfill.copy-readme', (done: Function) => {
  return src('scripts/polyfill/readme.md')
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});
