import { task } from 'gulp';
import { join } from 'path';
import { DIST_BUILD_ES2015_ROOT, DIST_BUILD_ROOT, DIST_BUILD_UMD_ROOT, ES5, ES_2015, PROJECT_ROOT, UMD_MODULE } from '../constants';
import { copySourceToDest, createTempTsConfig, deleteFiles, runNgc, runTsc } from '../util';

export function buildIonicAngularUmdTsc(excludeSpec: boolean, stripDebug: boolean, done: Function) {
  const stream = copySourceToDest(DIST_BUILD_UMD_ROOT, excludeSpec, true, stripDebug);
  stream.on('end', () => {
    // the source files are copied, copy over a tsconfig from
    createTempTsConfig([join('.', '**', '*.ts')], ES5, UMD_MODULE, join(PROJECT_ROOT, 'tsconfig.json'), join(DIST_BUILD_UMD_ROOT, 'tsconfig.json'), { importHelpers: false });
    runTsc(join(DIST_BUILD_UMD_ROOT, 'tsconfig.json'), (err) => {
      if (err) {
        done(err);
        return;
      }

      // clean up any .ts files that remain as well as ngc metadata
      deleteFiles([`${DIST_BUILD_UMD_ROOT}/**/*.ts`,
      `${DIST_BUILD_UMD_ROOT}/node_modules`,
      `${DIST_BUILD_UMD_ROOT}/tsconfig.json`,
      `!${DIST_BUILD_UMD_ROOT}/**/*.d.ts`], done);
    });
  });
}

/* this task builds out the necessary stuff for karma */
task('compile.karma', (done: Function) => {
  buildIonicAngularUmdTsc(false, false, done);
});

/* this task builds out the ionic-angular (commonjs and esm) directories for release */
task('compile.release', async (done: Function) => {
  try {
    await Promise.all([
      compile(ES_2015, ES_2015, DIST_BUILD_ES2015_ROOT),
      compile(ES5, ES_2015, DIST_BUILD_ROOT),
    ]);
  } catch (error) {
    done(error);
  }
});

async function compile(target: string, moduleType: string, dest: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stream = copySourceToDest(dest, true, true, true);
    stream.on('end', () => {
      // the source files are copied, copy over a tsconfig from
      createTempTsConfig(
        ['./public-api.ts'],
        target,
        moduleType,
        join(PROJECT_ROOT, 'tsconfig.json'),
        join(dest, 'tsconfig.json')
      );
      runNgc(join(dest, 'tsconfig.json'), (err) => {
        if (err) {
          reject(err);
        }

        // clean up any .ts files that remain as well as ngc metadata
        deleteFiles([`${dest}/**/*.ts`,
        `${dest}/node_modules`,
        `${dest}/tsconfig.json`,
        `!${dest}/**/*.d.ts`]);

        resolve();
      });
    });
  });
}
