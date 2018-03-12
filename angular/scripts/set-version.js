const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageLockPath = path.join(__dirname, '../package-lock.json');


function getVersion() {
  return process.argv[process.argv.length - 1];
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
packageJson.version = getVersion();

const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8'));
packageLock.version = packageJson.version;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2) + '\n');
