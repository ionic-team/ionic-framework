'use strict';

const request = require('request');

class Snapshot {
  constructor(options) {
    this.appId = (options && options.appId) || 'test_app';
    this.domain = (options && options.domain) || 'localhost:8080';
    this.groupId = (options && options.groupId) || 'test_group';
    this.sleepTime = (options && options.sleepBetweenSpecs) || 500;
    this.totalSpecs = options && options.totalSpecs;
    this.accessKey = options && options.accessKey;
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

    this.testId = (options && options.testId);
    this.queue = [];
    this.highestMismatch = 0;
    this.mismatches = [];
    this.results = {};
  }

  async finish() {
    console.log('waiting for uploads to complete');
    await Promise.all(this.queue);
    console.log(`done processing ${this.queue.length} screenshots`);
    console.log(`${this.mismatches.length} snapshots had significant mismatches`);
    console.log(`Test Id: ${this.testId}`);
    console.log(`URL: https://${this.domain}/${this.groupId}/${this.appId}/${this.testId}`);
  }

  async takeScreenshot(driver, options) {
    this._resizeWindow(driver);
    await this._allowForAnnimation();
    const screenshot = await this._takeScreenshot(driver, options);
    return this._post(screenshot);
  }

  _allowForAnnimation() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve();
      }, this.sleepTime);
    });
  }

  _post(screenshot) {
    const p = new Promise((resolve, reject) => {
      request.post(`http://${this.domain}/screenshot`, { form: screenshot }, (error, res, body) => {
        if (error) {
          console.error(error);
        } else if (res.statusCode > 400) {
          console.log('error posting screenshot:', response.statusCode, body);
        } else {
          const data = JSON.parse(body);
          this.highestMismatch = Math.max(this.highestMismatch, data.Mismatch);
          const resultKey = (data.Mismatch * 1000 + 1000000 + '').split('.')[0] + '-' + screenshot.spec_index;
          this.results[resultKey] = {
            index: screenshot.spec_index,
            name: screenshot.description,
            mismatch: Math.round(data.Mismatch * 100) / 100,
            compareUrl: data.CompareUrl,
            screenshotUrl: data.ScreenshotUrl
          };
          if (data.IsMismatch) {
            this.mismatches.push(resultKey);
          }
        }
        resolve(res);
      });
    });
    this.queue.push(p);
    return Promise.resolve(true);
  }

  _resizeWindow(driver) {
    return driver
      .manage()
      .window()
      .setSize(this.width, this.height);
  }

  _getQueryString(field, url) {
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(url);
    return string ? string[1] : null;
  };

  async _takeScreenshot(driver, options) {
    const capabilities = await driver.getCapabilities();

    const png = await driver.takeScreenshot();
    let url = await driver.getCurrentUrl();

    // TODO remove the modified url/description once we're happy with the comparison to v3
    let platform = 'android';

    if (url.indexOf('ionic:mode') > -1) {
      platform = this._getQueryString('ionic:mode', url);
    }

    let replacedUrl = url.replace('3333', '8876').replace('src/components', '/e2e').replace('test/', '').replace(`?ionic:mode=${platform}`, '');
    url = replacedUrl + `/index.html?ionic:mode=${platform}&ionicOverlayCreatedDiff=0&snapshot=true`;

    let description = options.name.replace(': ', `: ${platform} `) + '.';

    return Promise.resolve({
      app_id: this.appId,
      group_id: this.groupId,
      description: description,
      spec_index: options.specIndex,
      total_specs: this.totalSpecs,
      test_id: this.testId,
      url: url,
      png_base64: png,
      height: this.height,
      width: this.width,
      platform_count: this.platformCount,
      platform_id: this.platformId,
      platform_index: this.platformIndex,
      browser: capabilities.get('browserName'),
      platform: capabilities.get('platform'),
      version: capabilities.get('version'),
      access_key: this.accessKey
    });
  }
}

module.exports = Snapshot;
