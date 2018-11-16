const tc = require('turbocolor');
const semver = require('semver');
const execa = require('execa');
const Listr = require('listr');

const common = require('./common');

const DIST_TAG = 'dev';

async function main() {
  try {
    const { packages } = common;
    const { version } = common.readPkg('core');

    const devVersion = await getDevVersion(version);

    const tasks = [];

    common.updatePackageVersions(tasks, packages, devVersion);
    common.publishPackages(tasks, packages, devVersion, DIST_TAG);

    const listr = new Listr(tasks);
    await listr.run();
  } catch (err) {
    console.log('\n', tc.red(err), '\n');
    process.exit(1);
  }
}

async function getDevVersion(version) {
  const date = new Date();
  const { stdout: sha } = await execa('git', ['log', '-1', '--format=%H']);
  const shortSha = sha.substring(0, 7);
  const baseVersion = semver.inc(version, 'minor');
  const timestamp = Math.round(date.getTime() / 1000);

  return `${baseVersion}-${DIST_TAG}.${timestamp}.${shortSha}`;
}

main();
