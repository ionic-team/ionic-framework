const request = require('axios');

class Snapshot {
  constructor(options = {}) {
    this.appId = options.appId || 'snapshots';
    this.domain = options.domain || 'ionic-snapshot-go.appspot.com';
    this.groupId = options.groupId || 'ionic-core';
    this.sleepTime = options.sleepBetweenSpecs || 500;
    this.totalSpecs = options.totalSpecs;
    this.accessKey = options.accessKey || process.env.IONIC_SNAPSHOT_KEY;
    this.testId = options.testId;
    this.queue = [];
    this.highestMismatch = 0;
    this.mismatches = [];
    this.results = {};
    this.platformId = options.platformDefaults.params.platform_id;
    this.platformIndex = options.platformDefaults.params.platform_index;
    this.platformCount = options.platformDefaults.params.platform_count;
    this.width = options.platformDefaults.params.width || -1;
    this.height = options.platformDefaults.params.height || -1;
  }

  processQueue() {
    return Promise.all(this.queue);
  }

  waitForAnimation() {
    return new Promise(resolve => setTimeout(resolve, this.sleepTime));
  }

  validateUpload(res) {
    if (res.statusCode >= 400) {
      throw new Error(`Error posting screenshot: ${res.statusText}`);
    }
    return res;
  }

  queueUpload(screenshot) {
    this.queue.push(() =>
      axios.post(`http://${this.domain}/screenshot`, screenshot)
        .then(this.validateUpload)
        .then(res => {
          this.highestMismatch = Math.max(this.highestMismatch, res.data.Mismatch);
          const resultKey = (data.Mismatch * 1000 + 1000000 + '').split('.')[0] + '-' + screenshot.spec_index;
          this.results[resultKey] = {
            index: screenshot.spec_index,
            name: screenshot.description,
            mismatch: Math.round(data.Mismatch * 100) / 100,
            compareUrl: res.data.CompareUrl,
            screenshotUrl: res.data.ScreenshotUrl
          };
          if (res.data.IsMismatch) {
            this.mismatches.push(resultKey);
          }
        })
    );
  }

  resizeWindow(driver) {
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

  async takeScreenshot(driver, options) {
    await this.resizeWindow(driver);
    await this.waitForAnimation();
    const capabilities = await driver.getCapabilities();

    const png = await driver.takeScreenshot();
    let url = await driver.getCurrentUrl();

    // TODO remove the modified url/description once we're happy with the comparison to v3
    let platform = 'android';

    if (url.indexOf('ionicplatform') > -1) {
      platform = this._getQueryString('ionicplatform', url);
    }

    let replacedUrl = url.replace('3333', '8876').replace('src/components', '/e2e').replace('test/', '').replace(`?ionicplatform=${platform}`, '');
    url = replacedUrl + `/index.html?ionicplatform=${platform}&ionicOverlayCreatedDiff=0&snapshot=true`;

    let description = options.name.replace(': ', `: ${platform} `) + '.';

    this.queueUpload({
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
