const ScreenshotConnector = require('@stencil/core/screenshot/screenshot-connector');
const fs = require('fs');
const path = require('path');
const https = require('https');

class LocalScreenshotConnector extends ScreenshotConnector {

  async downloadImage(image) {
    return new Promise((resolve, reject) => {
      const req = https.request({
        method: 'GET',
        hostname: 'screenshot.ionicframework.com',
        path: `/images/${image}`,
      });

      req.on('response', res => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Bad Status Code: ${res.statusCode}`));
        }

        const f = fs.createWriteStream(path.join(this.imagesDir, image));
        f.on('error', reject);

        res.on('error', reject);
        res.on('end', resolve);
        res.pipe(f);
      });

      req.on('error', reject);
      req.end();
    });
  }

  async pullMasterImages() {
    const timespan = this.logger.createTimeSpan(`pull master screenshot images started`);

    const masterFilePaths = (fs.readdirSync(this.masterDir)).map(f => path.join(this.masterDir, f)).filter(f => f.endsWith('.json'));
    const masterScreenshots = masterFilePaths.map(f => JSON.parse(fs.readFileSync(f, 'utf-8')));
    const masterImageNames = masterScreenshots.map(s => s.image);
    const missingImages = masterImageNames.filter(masterImageName => {
      try {
        const masterImagePath = path.join(this.imagesDir, masterImageName);
        fs.accessSync(masterImagePath);
        return false;
      } catch (e) {}
      return true
    });

    if (missingImages.length > 0) {
      await Promise.all(missingImages.map(async image => {
        this.logger.debug(`downloading: ${image}`);

        try {
          await this.downloadImage(image);
        } catch (e) {
          this.logger.error(`Error with ${image}: ${e}`);
          throw e;
        }
      }));
    }

    timespan.finish(`pull master screenshot images finished`);
  }

}

module.exports = LocalScreenshotConnector;
