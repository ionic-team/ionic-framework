'use strict';

const fs = require('fs');
const webdriver = require('selenium-webdriver');
const Snapshot = require('./Snapshot');

let snapshotTool;
function getSnapshotTool() {
  if (!snapshotTool) {
    snapshotTool = new Snapshot({
      platformDefaults: {
        params: {
          height: 800,
          width: 400
        }
      }
    });
  }
  return snapshotTool;
}

function registerE2ETest(desc, tst) {
  // NOTE: Do not use an arrow function here because: https://mochajs.org/#arrow-functions
  it(desc, async function() {
    const driver = new webdriver.Builder().forBrowser('chrome').build();
    await tst(driver);
    if (process.env.takeScreenshots) {
      const snapshot = getSnapshotTool();
      await snapshot.takeScreenshot(driver, {
        name: this.test.fullTitle()
      });
    }
    return driver.quit();
  });
}

module.exports = registerE2ETest;
