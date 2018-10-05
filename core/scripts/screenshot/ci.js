const LocalScreenshotConnector = require('./local');
const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');
const execa = require('execa');
const stream = require('stream');

const S3_BUCKET = 'screenshot.ionicframework.com';
const s3 = new S3({ apiVersion: '2006-03-01' });


class CIScreenshotConnector extends LocalScreenshotConnector {

  async initBuild(opts) {
    const result = await execa.stdout('git', ['log', '-1', '--format=%h%n%an <%ae>%n%ct%n%s']);
    const [ sha1short, author, timestamp, msg ] = result.split('\n');

    const date = new Date(timestamp * 1000);

    opts.buildId = sha1short;
    opts.buildMessage = `${author} @ ${date.toISOString()}: ${msg}`;

    await super.initBuild(opts);
  }

  async uploadImage(image) {
    const file = path.join(this.imagesDir, image);
    const stream = fs.createReadStream(file);
    const key = `data/images/${image}`;

    await this.uploadStream(stream, key);
  }

  async uploadStream(stream, key, extra = {}) {
    try {
      await s3.headObject({ Bucket: S3_BUCKET, Key: key }).promise();
    } catch (e) {
      if (e.statusCode !== 404) {
        throw e;
      }

      this.logger.debug(`uploading: ${key}`);
      await s3.upload({ Bucket: S3_BUCKET, Key: key, Body: stream, ...extra }).promise();
    }
  }

  async publishBuild(build) {
    const timespan = this.logger.createTimeSpan(`publishing build started`);
    const images = build.screenshots.map(screenshot => screenshot.image);
    const buildBuffer = Buffer.from(JSON.stringify(build, undefined, 2));
    const buildStream = new stream.PassThrough();
    buildStream.end(buildBuffer);

    await Promise.all(images.map(async image => this.uploadImage(image)));
    await this.uploadStream(buildStream, `data/builds/${build.id}.json`, { ContentType: 'application/json' });

    if (this.updateMaster) {
      const buildStream = new stream.PassThrough();
      buildStream.end(buildBuffer);
      const key = `data/builds/master.json`;
      this.logger.debug(`uploading: ${key}`);
      await s3.upload({ Bucket: S3_BUCKET, Key: key, Body: buildStream, ContentType: 'application/json' }).promise();
    }

    timespan.finish(`publishing build finished`);
  }

}

module.exports = CIScreenshotConnector;
