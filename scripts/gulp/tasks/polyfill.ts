import { dest, src, task } from 'gulp';
import { readFileAsync, writeFileAsync, writePolyfills } from '../util';
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
  return readFileAsync(join('scripts', 'polyfill', 'readme.md')).then((fileContent: string) => {
    return writeFileAsync(join('dist', 'ionic-angular', 'polyfills', 'readme.md'), fileContent);
  }).then(() => {
    done();
  });
});
