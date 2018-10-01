const ScreenshotConnector = require('@stencil/core/screenshot/screenshot-connector');
const fs = require('fs');
const path = require('path');


class LocalScreenshotConnector extends ScreenshotConnector {

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

    missingImages.forEach(missingImage => {
      const url = missingImage;
      this.logger.info(`downloading: ${url}`);
    });

    timespan.finish(`pull master screenshot images finished`);
  }

}

module.exports = LocalScreenshotConnector;
