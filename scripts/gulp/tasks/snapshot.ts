import { task } from 'gulp';
import { PROJECT_ROOT } from '../constants';
import { mergeObjects } from '../util';
import * as path from 'path';

let protractorHttpServer: any;

task('protractor-server', () => {
  const connect = require('connect');
  const http = require('http');
  const serveStatic = require('serve-static');
  const buildConfig = require('../../build/config');
  const app =  connect().use(serveStatic(PROJECT_ROOT));
  protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);
  console.log(`Serving ${process.cwd()} on http://localhost:${buildConfig.protractorPort}`);
});

task('snapshot', ['e2e.build', 'protractor-server'], (done: Function) => {
  snapshot(done);
});

task('snapshot.skip.build', ['protractor-server'], (done: Function) => {
  snapshot(done);
});

task('snapshot.quick', ['e2e.build', 'protractor-server'], (done: Function) => {
  snapshot(done, true);
});

task('e2e.publish', (done: Function) => {
  let testId = generateTestId();
  e2ePublish(testId, true);
});

function snapshot(callback: Function, quickMode: boolean = false) {
  const snapshotConfig = require('../../snapshot/snapshot.config').config;
  const protractorConfigFile = path.resolve(PROJECT_ROOT, 'scripts/snapshot/protractor.config.js');
  const argv = require('yargs').argv;

  let snapshotDefaults = snapshotConfig.platformDefaults || {};
  let snapshotValues: any = mergeObjects(snapshotDefaults, argv || {});

  if (!snapshotConfig.accessKey || !snapshotConfig.accessKey.length) {
    console.error('Missing IONIC_SNAPSHOT_KEY environment variable');
    return callback(new Error('Missing IONIC_SNAPSHOT_KEY environment variable'));
  }

  let testId = generateTestId();

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
    '--params.upload=' +  snapshotValues.params.upload
  ];

  e2ePublish(testId, false);

  return protractor(callback, [protractorConfigFile].concat(protractorArgs));
}

function protractor(callback, args) {
  var cp = require('child_process');
  var errored = false;
  var callbackCalled = false;
  var child = cp.spawn('protractor', args, {
    stdio: [process.stdin, process.stdout, 'pipe']
  });

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

function e2ePublish(testId, verbose) {
  let snapshotConfig = require('../../snapshot/snapshot.config').config;
  console.log('e2ePublish: ' + testId);
  snapshotConfig.testId = testId;
  snapshotConfig.verbose = verbose;
  require('../../e2e/e2e-publish')(snapshotConfig);
}

function generateTestId() {
  var chars = 'abcdefghijkmnpqrstuvwxyz';
  var id = chars.charAt(Math.floor(Math.random() * chars.length));
  chars += '0123456789';
  while (id.length < 3) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
