const LocalScreenshotConnector = require('./local');
const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');

const S3_BUCKET = 'screenshot.ionicframework.com';
const s3 = new S3({ apiVersion: '2006-03-01' });


class CIScreenshotConnector extends LocalScreenshotConnector {

  async publishBuild() {
    const timespan = this.logger.createTimeSpan(`publishing build started`);
    const images = this.masterBuild.screenshots.map(screenshot => screenshot.image);

    await Promise.all(images.map(async image => {
      try {
        await s3.headObject({ Bucket: S3_BUCKET, Key: `images/${image}` }).promise();
      } catch (e) {
        if (e.statusCode !== 404) {
          throw e;
        }

        this.logger.debug(`uploading: ${image}`);
        const stream = fs.createReadStream(path.join(this.imagesDir, image));
        await s3.upload({ Bucket: S3_BUCKET, Key: `images/${image}`, Body: stream }).promise();
      }
    }));

    timespan.finish(`publishing build finished`);
  }

}

module.exports = CIScreenshotConnector;
