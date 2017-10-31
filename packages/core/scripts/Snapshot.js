'use strict';

const fs = require('fs'); // temp hack for now...
const http = require('http');

class Snapshot {
  constructor(options) {
    this.appId = (options && options.appId) || 'test_app';
    this.domain = (options && options.domain) || 'localhost:8080';
    this.groupId = (options && options.groupId) || 'test_group';
    this.sleepTime = (options && options.sleepBetweenSpecs) || 500;
    this.platformId =
      options && options.platformDefaults && options.platformDefaults.params && options.platformDefaults.params.platform_id;
    this.platformIndex =
      options && options.platformDefaults && options.platformDefaults.params && options.platformDefaults.params.platform_index;
    this.platformCount =
      options && options.platformDefaults && options.platformDefaults.params && options.platformDefaults.params.platform_count;
    this.width =
      (options && options.platformDefaults && options.platformDefaults.params && options.platformDefaults.params.width) || -1;
    this.height =
      (options && options.platformDefaults && options.platformDefaults.params && options.platformDefaults.params.height) || -1;
  }

  async takeScreenshot(driver, options) {
    this._resizeWindow(driver);
    await this._allowForAnnimation();
    const data = await this._takeScreenshot(driver, options && options.name);
    return this._postScreenshot(data);
  }

  _allowForAnnimation() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve();
      }, this.sleepTime);
    });
  }

  _postScreenshot(data) {
    return new Promise((resolve, reject) => {
      let base64Data = data.png_base64.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(`${data.description}.png`, base64Data, 'base64', function(err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  _resizeWindow(driver) {
    return driver
      .manage()
      .window()
      .setSize(this.width, this.height);
  }

  async _takeScreenshot(driver, name) {
    const png = await driver.takeScreenshot();
    const url = await driver.getCurrentUrl();

    // TODO: There are more things to add, not sure how yet for some
    return Promise.resolve({
      description: name,
      url: url,
      png_base64: png
    });
  }
}

module.exports = Snapshot;
