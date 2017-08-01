import { task, src, dest } from 'gulp';
import { writePolyfills } from '../util';
import { join } from 'path';

task('polyfill', ['polyfill.copy-readme', 'polyfill.write']);

task('polyfill.write', (done: Function) => {
  writePolyfills(join('dist', 'ionic-angular', 'polyfills')).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('polyfill.copy-readme', (done: Function) => {
  return src(join('scripts', 'polyfill', 'readme.md'))
    .pipe(dest(join('dist', 'ionic-angular', 'polyfills')), done);
});
