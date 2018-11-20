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
    const result = await execa.stdout('git', ['log', '-1', '--format=%H%n%an <%ae>%n%ct%n%s']);
    const [ sha1, author, timestamp, msg ] = result.split('\n');
    const sha1short = sha1.slice(0, 7);

    opts.buildId = sha1short;
    opts.buildMessage = msg;
    opts.buildAuthor = author;
    opts.buildUrl = BUILD_URL + sha1short;
    opts.previewUrl = `https://${S3_BUCKET}/${sha1short}`;
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
    const imageBatches = [];

    while (images.length > 0) {
      imageBatches.push(images.splice(0, 10));
    }

    for (const batch of imageBatches) {
      await Promise.all(batch.map(async image => this.uploadImage(image)));
    }

    const buildBuffer = Buffer.from(JSON.stringify(currentBuild, undefined, 2));
    const buildStream = new stream.PassThrough();
    buildStream.end(buildBuffer);

    const uploads = [
      this.uploadStream(buildStream, `data/builds/${currentBuild.id}.json`, { ContentType: 'application/json' }),
    ];

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

    await this.uploadTests(results);

    return results;
  }

  async uploadTests(results) {
    const timespan = this.logger.createTimeSpan(`uploading tests started`);

    const appRoot = path.join(__dirname, '..', '..');
    let uploadPaths = [];

    const cssDir = path.join(appRoot, 'css');
    fs.readdirSync(cssDir).forEach(cssFile => {
      uploadPaths.push(path.join(cssDir, cssFile));
    });

    uploadPaths.push(path.join(appRoot, 'scripts', 'testing', 'styles.css'));

    const distDir = path.join(appRoot, 'dist');
    uploadPaths.push(path.join(distDir, 'ionic.js'));

    const distIonicDir = path.join(distDir, 'ionic');
    fs.readdirSync(distIonicDir).forEach(distIonicFile => {
      uploadPaths.push(path.join(distIonicDir, distIonicFile));
    });

    const distIonicSvgDir = path.join(distIonicDir, 'svg');
    fs.readdirSync(distIonicSvgDir).forEach(distIonicSvgFile => {
      uploadPaths.push(path.join(distIonicSvgDir, distIonicSvgFile));
    });

    results.currentBuild.screenshots.forEach(screenshot => {
      const testDir = path.dirname(screenshot.testPath);
      const testIndexHtml = path.join(appRoot, testDir, 'index.html');
      if (!uploadPaths.includes(testIndexHtml)) {
        uploadPaths.push(testIndexHtml);
      }
    });

    uploadPaths = uploadPaths.filter(p => p.endsWith('.js') || p.endsWith('.css') || p.endsWith('.html') || p.endsWith('.svg'));

    const fileCount = uploadPaths.length;

    const uploadBatches = [];
    while (uploadPaths.length > 0) {
      uploadBatches.push(uploadPaths.splice(0, 20));
    }

    for (const batch of uploadBatches) {
      await Promise.all(batch.map(async uploadPath => {
        const stream = fs.createReadStream(uploadPath);
        const relPath = path.relative(appRoot, uploadPath);
        const key = `data/tests/${results.currentBuild.id}/${relPath}`;

        let contentType = 'text/plain';
        if (uploadPath.endsWith('.js')) {
          contentType = 'application/javascript'
        } else if (uploadPath.endsWith('.css')) {
          contentType = 'text/css'
        } else if (uploadPath.endsWith('.html')) {
          contentType = 'text/html'
        } else if (uploadPath.endsWith('.svg')) {
          contentType = 'image/svg+xml'
        }

        this.logger.debug(`uploading: ${key} ${contentType}`);
        await s3.upload({ Bucket: S3_BUCKET, Key: key, Body: stream, ContentType: contentType }).promise();
      }));
    }

    timespan.finish(`uploading tests finished: ${fileCount} files`);
  }

  async getScreenshotCache() {
    const timespan = this.logger.createTimeSpan(`get screenshot cache started`, true);

    try {
      const ws = fs.createWriteStream(this.screenshotCacheFilePath);
      const p = `/data/compares/screenshot-cache.json?ts=${Date.now()}`;
      await this.downloadToStream(ws, p);

    } catch (e) {
      this.logger.debug(e);
    }

    timespan.finish(`get screenshot cache finished`);

    return super.getScreenshotCache();
  }

  async updateScreenshotCache(cache, buildResults) {
    const timespan = this.logger.createTimeSpan(`update screenshot cache started`, true);

    cache = await super.updateScreenshotCache(cache, buildResults);

    const cacheBuffer = Buffer.from(JSON.stringify(cache, undefined, 2));
    const cacheStream = new stream.PassThrough();
    cacheStream.end(cacheBuffer);

    const key = `data/compares/screenshot-cache.json`;
    this.logger.debug(`uploading: ${key}`);

    await s3.upload({ Bucket: S3_BUCKET, Key: key, Body: cacheStream, ContentType: 'application/json' }).promise();

    timespan.finish(`update screenshot cache finished`);

    return cache;
  }

}

module.exports = CIScreenshotConnector;
