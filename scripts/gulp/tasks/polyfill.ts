import { task, src, dest } from 'gulp';
import { writePolyfills } from '../util';

task('polyfill', ['polyfill.copy-readme', 'polyfill.write']);

task('polyfill.write', (done: Function) => {
  writePolyfills('dist/ionic-angular/polyfills').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('polyfill.copy-readme', (done: Function) => {
  return src('scripts/polyfill/readme.md')
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});
