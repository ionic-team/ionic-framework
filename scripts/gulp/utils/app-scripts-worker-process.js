const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

process.on('message', (msg) => {
  try {
    runAppScripts(msg)
      .then((val) => {
        taskResolve(msg.appEntryPoint, val);
      }, (val) => {
        taskReject(msg.appEntryPoint, val);
      })
      .catch((err) => {
        taskError(msg.appEntryPoint, err);
      });
  } catch (ex) {
    taskError(msg.appEntryPoint, ex);
    process.exit(1);
  }
});

function runAppScripts(msg) {
  console.log('\n\n\n\n');
  console.log(`Running ionic-app-scripts build --prod for ${msg.appEntryPoint}`);
  let scriptArgs = [
    'build',
    '--aot',
    '--appEntryPoint', msg.appEntryPoint,
    '--appNgModulePath', msg.appNgModulePath,
    '--srcDir', msg.srcDir,
    '--wwwDir', msg.distDir,
    '--tsconfig', msg.tsConfig,
    '--readConfigJson', 'false',
    '--experimentalParseDeepLinks', 'true',
    '--ionicAngularDir', msg.ionicAngularDir,
    '--sass', msg.sassConfigPath,
    '--copy', msg.copyConfigPath,
    '--aotWriteToDisk', 'true'
  ];

  if (msg.debug) {
    scriptArgs.push('--debug');
  }

  return new Promise((resolve, reject) => {

    const args = [msg.pathToAppScripts].concat(scriptArgs);
    console.log(`node ${args.join(' ')}`);



    /*const spawnedCommand = spawn('node', args);

    spawnedCommand.on('error', (err) => {
    });

    spawnedCommand.stdout.on('data', (buffer) => {
      console.log(buffer.toString());
    });

    spawnedCommand.stderr.on('data', (buffer) => {
      console.log(buffer.toString());
    });

    spawnedCommand.on('close', (code) => {
      if (code === 0) {
        return resolve();
      }
      reject(new Error('App-scripts failed with non-zero status code'));
    });
    */

    const stringToExecute = `node ${args.join(' ')}`;
    exec(stringToExecute, (err, stderr, stdout) => {
      if (err) {
        console.log('ERROR: ', err.message);
      } else {
        console.log('stderr: ', stderr);
        console.log('stdout: ', stdout);
      }
    });
  });
}


function taskResolve(appEntryPoint, val) {
  const msg = {
    appEntryPoint: appEntryPoint,
    resolve: val,
    pid: process.pid
  };

  console.log(`worker resolve, appEntryPoint: ${msg.appEntryPoint}, pid: ${msg.pid}`);

  process.send(msg);
}


function taskReject(appEntryPoint, val) {
  const msg = {
    appEntryPoint: appEntryPoint,
    reject: new Error(val),
    pid: process.pid
  };

  console.log(`worker reject, appEntryPoint: ${appEntryPoint}, pid: ${msg.pid}`);

  process.send(msg);
}




function taskError(appEntryPoint, err) {
  const msg = {
    appEntryPoint: appEntryPoint,
    error: new Error(err),
    pid: process.pid
  };

  console.log(`worker error, appEntryPoint: ${appEntryPoint}, pid: ${msg.pid}`);

  process.send(msg);
}
