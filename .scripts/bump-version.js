const semver = require('semver');

const getDevVersion = () => {
  const originalVersion = require('../lerna.json').version;
  const baseVersion = semver.inc(originalVersion, 'patch');

  return baseVersion;
}

console.log(getDevVersion());
