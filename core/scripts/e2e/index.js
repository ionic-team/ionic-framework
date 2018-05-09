'use strict';

const fs = require('fs');
const glob = require('glob');
const Mocha = require('mocha');
const path = require('path');
const webdriver = require('selenium-webdriver');
const argv = require('yargs').argv;

const Page = require('./page');
const Snapshot = require('./snapshot');

const platforms = ['md', 'ios'];

let driver;
let snapshot;
let specIndex = 0;
let takeScreenshots = false;
let folder = null;

function startDevServer() {
  const server = require('@stencil/dev-server/dist'); // TODO: fix after stencil-dev-server PR #16 is merged
  const cmdArgs = [
    '--config',
    path.join(__dirname, '../../stencil.config.js'),
    '--no-open'
  ];

  return server.run(cmdArgs);
}

function generateTestId() {
  let chars = 'abcdefghjkmnpqrstuvwxyz';
  let id = chars.charAt(Math.floor(Math.random() * chars.length));
  chars += '0123456789';
  while (id.length < 3) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function getTestFiles() {
  return new Promise((resolve, reject) => {
    let src = path.join(__dirname, '../../src/**/e2e.js');

    if (folder) {
      src = path.join(__dirname, `../../src/**/${folder}/**/e2e.js`);
    }

    glob(src, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function startDriver() {
  // setting chrome options to start the browser without an info bar
  let chromeCapabilities = webdriver.Capabilities.chrome();
  const chromeOptions = {
    // 'args': ['--disable-infobars']
  };
  chromeCapabilities.set('chromeOptions', chromeOptions);

  return new webdriver.Builder()
    .withCapabilities(chromeCapabilities)
    .forBrowser('chrome')
    .build();
}

function processCommandLine() {
  if (argv.snapshot) {
    takeScreenshots = true;
  }

  if (argv.f || argv.folder) {
    folder = argv.f || argv.folder;
  }
}

function registerE2ETest(desc, tst) {
  // NOTE: Do not use an arrow function here because: https://mochajs.org/#arrow-functions
  it(desc, async function() {
    await tst(driver, this);
    if (takeScreenshots) {
      await snapshot.takeScreenshot(driver, {
        name: this.test.fullTitle().replace(/(^[\w-]+\/[\w-]+)/, '$1:'),
        specIndex: specIndex++
      });
    }
  });
}

function getTotalTests(suite) {
  let ttl = suite.tests.length;
  suite.suites.forEach(s => (ttl += getTotalTests(s)));
  return ttl;
}

async function run() {
  // TODO look into removing chrome startup from the timeout
  const mocha = new Mocha({
    timeout: 5000,
    slow: 2000
  });

  driver = startDriver();
  processCommandLine();

  const devServer = await startDevServer();

  const files = await getTestFiles();
  files.forEach(f => mocha.addFile(f));
  snapshot = await mochaLoadFiles(mocha);
  const failures = await mochaRun(mocha);

  if (takeScreenshots) {
    snapshot.finish();
  }

  devServer.close();
  await driver.quit();

  if (failures) {
    throw new Error(failures);
  }
}

function mochaRun(mocha) {
  return new Promise((resolve, reject) => {
    mocha.run(function(failures) {
      resolve(failures);
    });
  });
}

function mochaLoadFiles(mocha) {
  return new Promise((resolve, reject) => {
    mocha.loadFiles(() => {
      specIndex = 0;

      snapshot = new Snapshot({
        groupId: 'ionic-core',
        appId: 'snapshots',
        testId: generateTestId(),
        domain: 'ionic-snapshot-go.appspot.com',
        // domain: 'localhost:8080',
        sleepBetweenSpecs: 750,
        totalSpecs: getTotalTests(mocha.suite),
        platformDefaults: {
          browser: 'chrome',
          platform: 'linux',
          params: {
            platform_id: 'chrome_400x800',
            platform_index: 0,
            platform_count: 1,
            width: 400,
            height: 814
          }
        },
        accessKey: process.env.IONIC_SNAPSHOT_KEY
      });
      resolve(snapshot);
    });
  });
}

function parseSemver(str) {
  return /(\d+)\.(\d+)\.(\d+)/
    .exec(str)
    .slice(1)
    .map(Number);
}

function validateNodeVersion(version) {
  const [major, minor] = parseSemver(version);

  if (major < 7 || (major === 7 && minor < 6)) {
    throw new Error(
      'Running the end-to-end tests requires Node version 7.6.0 or higher.'
    );
  }
}

// Invoke run() only if executed directly i.e. `node ./scripts/e2e`
if (require.main === module) {
  validateNodeVersion(process.version);
  run()
    .then(() => {})
    .catch(err => {
      console.log(err);
      // fail with non-zero status code
      process.exit(1);
    });
}

module.exports = {
  Page,
  platforms: platforms,
  register: registerE2ETest,
  run: run
};
