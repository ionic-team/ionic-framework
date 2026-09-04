const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('node:child_process');

const testName = 'schematics-test';
const packageRootDir = path.join(__dirname, '..');
const testDir = path.join(packageRootDir, testName);

try {
  // Delete old packages
  execSync(`rm -f *.tgz`, {cwd: packageRootDir});

  // Pack ionic-core
  execSync(`npm pack ../../core`, {cwd: packageRootDir});

  // Pack ionic-angular
  execSync(`npm pack`, {cwd: packageRootDir});

  // Create new Angular project
  execSync(`npx ng new ${testName} --style css --ssr false --ai-config none`, {cwd: packageRootDir});

  // Install ionic-angular and core packages
  execSync(`npx ng add --skip-confirmation ../ionic-angular-*`, {cwd: testDir});
  execSync(`npm install ../*.tgz --no-save`, {cwd: testDir});

  // Run build
  execSync(`npm run build`, {cwd: testDir});
} catch(error) {
  console.log(error);
  process.exitCode = 1;
}

fs.removeSync(testDir);
execSync(`rm -f *.tgz`, {cwd: packageRootDir});
