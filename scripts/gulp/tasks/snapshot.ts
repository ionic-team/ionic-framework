import { task } from 'gulp';
import { DIST_E2E_ROOT, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';
import { mergeObjects } from '../util';
import * as path from 'path';


task('snapshot', ['e2e'], (done: Function) => {
  snapshot(false, done);
});

task('snapshot.skip.build', (done: Function) => {
  snapshot(false, done);
});

task('snapshot.quick', (done: Function) => {
  snapshot(true, done);
});

function snapshot(quickMode: boolean, callback: Function) {
  const snapshotConfig = require('../../snapshot/snapshot.config').config;
  const protractorConfigFile = path.resolve(SCRIPTS_ROOT, 'snapshot/protractor.config.js');
  const argv = require('yargs').argv;

  const snapshotDefaults = snapshotConfig.platformDefaults || {};
  const snapshotValues: any = mergeObjects(snapshotDefaults, argv || {});

  if (!snapshotConfig.accessKey || !snapshotConfig.accessKey.length) {
    console.error('Missing IONIC_SNAPSHOT_KEY environment variable');
    return callback(new Error('Missing IONIC_SNAPSHOT_KEY environment variable'));
  }

  let specs = '**';
  let specArg = argv.specs || argv.s;
  if (specArg && specArg.length) {
    specs = path.join(specArg, '**');
  }
  specs = path.join(DIST_E2E_ROOT, 'tests', specs, '*e2e.js');
  console.log(`Specs: ${specs}`);

  const testId = generateTestId();

  snapshotValues.params.test_id = testId;
  snapshotValues.params.upload = !quickMode;

  var protractorArgs = [
    '--browser ' + snapshotValues.browser,
    '--platform ' + snapshotValues.platform,
    '--params.platform_id=' +  snapshotValues.params.platform_id,
    '--params.platform_index=' +  snapshotValues.params.platform_index,
    '--params.platform_count=' +  snapshotValues.params.platform_count,
    '--params.width=' +  snapshotValues.params.width,
    '--params.height=' +  snapshotValues.params.height,
    '--params.test_id=' +  snapshotValues.params.test_id,
    '--params.upload=' +  snapshotValues.params.upload,
    '--specs=' + specs
  ];

  return protractor(callback, [protractorConfigFile].concat(protractorArgs));
}

function protractor(callback, args) {
  const connect = require('connect');
  const http = require('http');
  const serveStatic = require('serve-static');
  const buildConfig = require('../../build/config');
  const app = connect().use(serveStatic(PROJECT_ROOT));
  const protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);

  console.log(`Serving ${process.cwd()} on http://localhost:${buildConfig.protractorPort}`);

  const cp = require('child_process');
  const child = cp.spawn('protractor', args, {
    stdio: [process.stdin, process.stdout, 'pipe']
  });

  let errored = false;
  let callbackCalled = false;

  child.stderr.on('data', function(data) {
    protractorHttpServer.close();
    console.error(data.toString());
    if (!errored) {
      errored = true;
      if (!callbackCalled) {
        callback('Protractor tests failed.');
        callbackCalled = true;
      }
    }
  });

  child.on('exit', function() {
    protractorHttpServer.close();
    if (!callbackCalled) {
      callback();
      callbackCalled = true;
    }
  });
}

function generateTestId() {
  let chars = 'abcdefghijkmnpqrstuvwxyz';
  let id = chars.charAt(Math.floor(Math.random() * chars.length));
  chars += '0123456789';
  while (id.length < 3) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
