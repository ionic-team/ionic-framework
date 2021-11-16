const ScreenshotConnector = require('@stencil/core/screenshot/local-connector');
const fs = require('fs');
const path = require('path');
const https = require('https');

class IonicConnector extends ScreenshotConnector {

  async pullIonicMasterBuild() {
    const timespan = this.logger.createTimeSpan(`pull master screenshot images started`);

    const ws = fs.createWriteStream(this.masterBuildFilePath);
    const p = `/data/builds/master.json?ts=${Date.now()}`;
    await this.downloadToStream(ws, p);
    this.logger.debug('downloadToStream successful');
    const masterBuild = await this.getMasterBuild();
    this.logger.debug('getMasterBuild successful');

    const masterImageNames = masterBuild.screenshots.map(s => s.image);
    const missingImages = masterImageNames.filter(masterImageName => {
      try {
        const masterImagePath = path.join(this.imagesDir, masterImageName);
        fs.accessSync(masterImagePath);
        return false;
      } catch (e) {}
      return true;
    });

    this.logger.debug(`number of missing images: ${missingImages.length}`);

    while (missingImages.length > 0) {
      const images = missingImages.splice(0, 20);

      this.logger.debug(`loading chunk of images[${images.length}], ${missingImages.length} missing images remaining`);

      await Promise.all(images.map(async image => {
        this.logger.debug(`downloading: ${image}`);

        try {
          await this.downloadImage(image);
        } catch (e) {
          this.logger.error(`Error with ${image}: ${e}`);
          throw e;
        }
      }));

      this.logger.debug('loading next chunk in array');
    }

    timespan.finish(`pull master screenshot images finished`);
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

  async downloadImage(image) {
    const stream = fs.createWriteStream(path.join(this.imagesDir, image));
    const p = `/data/images/${image}`;

    await this.downloadToStream(stream, p);
  }

}

module.exports = IonicConnector;
