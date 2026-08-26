const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('node:child_process');

const testName = 'schematics-test';
const packageRootDir = path.join(__dirname, '..');
const testDir = path.join(packageRootDir, testName);

try {
  // Delete old packages
  fs.removeSync(`*.tgz`);

  // Pack ionic-angular
  execSync(`npm pack`, {cwd: packageRootDir});

  // Create new Angular project
  execSync(`npx ng new ${testName} --style css --ssr false --ai-config none`, {cwd: packageRootDir});

  // Install ionic-angular package
  execSync(`npx ng add --skip-confirmation ../ionic-angular-*`, {cwd: testDir});

  // Run build
  execSync(`npm run build`, {cwd: testDir});
} catch(error) {
  console.log(error);
  process.exitCode = 1;
}

fs.removeSync(testDir);
