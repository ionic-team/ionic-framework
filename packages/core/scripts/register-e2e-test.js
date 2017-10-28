'use strict';

const fs = require('fs');
const webdriver = require('selenium-webdriver');

function takeScreenshot(driver, name) {
  return driver.takeScreenshot().then(function(data) {
    var base64Data = data.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(`${name}.png`, base64Data, 'base64', function(err) {
      if (err) console.log(err);
    });
  });
}

function allowForAnnimation() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve();
    }, 300);
  });
}

function registerE2ETest(desc, tst) {
  it(desc, async () => {
    const driver = new webdriver.Builder().forBrowser('chrome').build();
    await tst(driver);
    if (process.env.takeScreenshots) {
      await allowForAnnimation();
      takeScreenshot(driver, desc);
    }
    return driver.quit();
  });
}

module.exports = registerE2ETest;
