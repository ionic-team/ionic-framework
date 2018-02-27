import { fork, ChildProcess } from 'child_process';
import { dirname, join } from 'path';

import { MessageToWorker, WorkerProcess } from './interfaces';

export function runWorker(pathToAppScripts: string, debug: boolean, appEntryPoint: string, appNgModulePath: string, srcDir: string, distDir: string, tsConfig: string, ionicAngularDir: string, sassConfigPath: string, copyConfigPath: string, isDev: boolean, minifyCss: boolean, minifyJs: boolean, optimizeJs: boolean) {
  return new Promise((resolve, reject) => {

    const msgToWorker: MessageToWorker = {
      pathToAppScripts: pathToAppScripts,
      appEntryPoint: appEntryPoint,
      appNgModulePath: appNgModulePath,
      debug: debug,
      srcDir: srcDir,
      distDir: distDir,
      tsConfig: tsConfig,
      ionicAngularDir: ionicAngularDir,
      sassConfigPath: sassConfigPath,
      copyConfigPath: copyConfigPath,
      isDev: isDev,
      minifyCss: minifyCss,
      minifyJs: minifyJs,
      optimizeJs: optimizeJs
    };

    const worker = <ChildProcess>createWorker(msgToWorker);

    console.log(`Starting to do a ${isDev ? 'dev' : 'prod'} build test ${appEntryPoint}`);

    worker.on('error', (err: any) => {
      console.error(`worker error, entrypoint: ${appEntryPoint}, pid: ${worker.pid}, error: ${err}`);
      reject(err);
    });

    worker.on('exit', (code: number) => {
      console.log(`Finished building test ${appEntryPoint}`);
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`${appEntryPoint} exited with non-zero status code`));
      }
    });
  });
}


export function createWorker(msg: MessageToWorker): any {
  for (var i = workers.length - 1; i >= 0; i--) {
    if (workers[i].appEntryPoint === msg.appEntryPoint) {
      try {
        workers[i].worker.kill('SIGKILL');
      } catch (e) {
        console.log(`createWorker, kill('SIGKILL'): ${e}`);
      } finally {
        delete workers[i].worker;
        workers.splice(i, 1);
      }
    }
  }

  // default it to use the test/basic, or test/xyz directory
  const deepLinksDir = dirname(dirname(msg.appNgModulePath));
  try {
      let scriptArgs = [
      'build',
      '--appEntryPoint', msg.appEntryPoint,
      '--appNgModulePath', msg.appNgModulePath,
      '--deepLinksDir', deepLinksDir,
      '--srcDir', msg.srcDir,
      '--wwwDir', msg.distDir,
      '--tsconfig', msg.tsConfig,
      '--readConfigJson', 'false',
      '--experimentalManualTreeshaking', 'false',
      '--experimentalPurgeDecorators', 'false',
      '--ionicAngularDir', msg.ionicAngularDir,
      '--sass', msg.sassConfigPath,
      '--copy', msg.copyConfigPath,
      '--enableLint', 'false',
      '--skipIonicAngularVersion', 'true'
    ];

    // TODO, use prod once we're a little more settled
    if (!msg.isDev) {
      scriptArgs.push('--aot');
    }

    if (msg.debug) {
      scriptArgs.push('--debug');
    }

    if (msg.minifyJs) {
      scriptArgs.push('--minifyJs');
    }

    if (msg.minifyCss) {
      scriptArgs.push('--minifyCss');
    }

    if (msg.optimizeJs) {
      scriptArgs.push('--optimizeJs');
    }

    const workerModule = join(process.cwd(), 'node_modules', '@ionic', 'app-scripts', 'bin', 'ionic-app-scripts.js');
    const worker = fork(workerModule, scriptArgs, {
      env: {
        FORCE_COLOR: true,
        npm_config_argv: process.env.npm_config_argv
      }
    });

    workers.push({
      appEntryPoint: msg.appEntryPoint,
      worker: worker
    });

    return worker;

  } catch (e) {
    throw new Error(`unable to create worker-process: ${e.msg}`);
  }
}


export const workers: WorkerProcess[] = [];
