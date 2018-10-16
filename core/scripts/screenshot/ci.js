const IonicConnector = require('./ionic');
const fs = require('fs');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');
const execa = require('execa');
const stream = require('stream');

const BUILD_URL = 'https://github.com/ionic-team/ionic/commit/';
const S3_BUCKET = 'screenshot.ionicframework.com';
const s3 = new S3({ apiVersion: '2006-03-01' });


class CIScreenshotConnector extends IonicConnector {

  async initBuild(opts) {
    const result = await execa.stdout('git', ['log', '-1', '--format=%h%n%an <%ae>%n%ct%n%s']);
    const [ sha1short, author, timestamp, msg ] = result.split('\n');

    opts.buildId = sha1short;
    opts.buildMessage = msg;
    opts.buildAuthor = author;
    opts.buildUrl = BUILD_URL + sha1short;
    opts.buildTimestamp = (timestamp * 1000);

    await super.initBuild(opts);
  }

  async uploadImage(image) {
    const file = path.join(this.imagesDir, image);
    const stream = fs.createReadStream(file);
    const key = `data/images/${image}`;

    await this.uploadStream(stream, key, { ContentType: 'image/png' });
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

  async pullMasterBuild() {
    await super.pullIonicMasterBuild();
  }

  async publishBuild(results) {
    const currentBuild = results.currentBuild;

    const timespan = this.logger.createTimeSpan(`publishing build started`);
    const images = currentBuild.screenshots.map(screenshot => screenshot.image);

    const uploads = images.map(async image => this.uploadImage(image));

    const buildBuffer = Buffer.from(JSON.stringify(currentBuild, undefined, 2));
    const buildStream = new stream.PassThrough();
    buildStream.end(buildBuffer);

    uploads.push(
      this.uploadStream(buildStream, `data/builds/${currentBuild.id}.json`, { ContentType: 'application/json' }),
    );

    if (this.updateMaster) {
      // master build
      // update the master data with this current build
      // no need to upload a compare data
      const buildStream = new stream.PassThrough();
      buildStream.end(buildBuffer);
      const key = `data/builds/master.json`;
      this.logger.debug(`uploading: ${key}`);
      uploads.push(
        s3.upload({ Bucket: S3_BUCKET, Key: key, Body: buildStream, ContentType: 'application/json' }).promise()
      );

    } else {
      // PR build
      // not updating master
      // upload compare data of the PR against the master data
      const compare = results.compare;
      compare.url = `https://${S3_BUCKET}/${compare.a.id}/${compare.b.id}`;

      const compareBuffer = Buffer.from(JSON.stringify(compare, undefined, 2));
      const compareStream = new stream.PassThrough();
      compareStream.end(compareBuffer);
      uploads.push(
        this.uploadStream(compareStream, `data/compares/${compare.id}.json`, { ContentType: 'application/json' })
      );
    }

    await Promise.all(uploads);

    timespan.finish(`publishing build finished`);

    return results;
  }

}

module.exports = CIScreenshotConnector;
