const fs = require('fs');
const path = require('path');
const semver = require('semver')

const pkgJsonPath = path.join(__dirname, '../package.json');
const pkgLockPath = path.join(__dirname, '../package-lock.json');
const readmePath = path.join(__dirname, '../README.md');

// get the version number from the last arg
const newVersion = process.argv[2];
semver.valid(newVersion);
if (!newVersion) {
  throw new Error('invalid version number: ' + newVersion);
}

// update the package.json
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
pkgJson.version = newVersion;

// update the package-lock.json
const pkgLock = JSON.parse(fs.readFileSync(pkgLockPath, 'utf-8'));
pkgLock.version = pkgJson.version;

// update the readme script tag
let readme = fs.readFileSync(readmePath, 'utf-8');
const cdnUrl = 'https://unpkg.com/' + pkgJson.name + '@' + pkgJson.version + '/dist/ionic.js'
readme = readme.replace(/https:\/\/unpkg.com(.*)ionic.js/, cdnUrl);

// save our changes
fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
fs.writeFileSync(pkgLockPath, JSON.stringify(pkgLock, null, 2) + '\n');
fs.writeFileSync(readmePath, readme);
