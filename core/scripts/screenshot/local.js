const ScreenshotConnector = require('@stencil/core/screenshot/screenshot-connector');
const fs = require('fs');
const path = require('path');
const https = require('https');

class LocalScreenshotConnector extends ScreenshotConnector {

  async downloadImage(image) {
    const stream = fs.createWriteStream(path.join(this.imagesDir, image));
    const p = `/data/images/${image}`;

    await this.downloadToStream(stream, p);
  }

  async downloadToStream(stream, p) {
    return new Promise((resolve, reject) => {
      const req = https.request({
        method: 'GET',
        hostname: 'screenshot.ionicframework.com',
        path: p,
      });

      req.on('response', res => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Bad Status Code: ${res.statusCode}`));
        }

        stream.on('error', reject);
        stream.on('close', resolve);

        res.on('error', reject);
        res.pipe(stream);
      });

      req.on('error', reject);
      req.end();
    });
  }

  async pullMasterBuild() {
    const timespan = this.logger.createTimeSpan(`pull master screenshot images started`);

    const ws = fs.createWriteStream(path.join(this.buildsDir, 'master.json'));
    const p = `/data/builds/master.json`;
    await this.downloadToStream(ws, p);
    const master = JSON.parse(fs.readFileSync(path.join(this.buildsDir, 'master.json'), 'utf8'));

    const masterImageNames = master.screenshots.map(s => s.image);
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
