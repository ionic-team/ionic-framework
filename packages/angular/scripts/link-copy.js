const fs = require('fs-extra');
const path = require('path');


let prjDir = process.argv[2];
if (!prjDir) {
  throw new Error('local path required as last argument to "npm run build.link" command');
}
prjDir = path.join(__dirname, '../../../', prjDir);
const prjIonicAngular = path.join(prjDir, 'node_modules/@ionic/angular');

const ionicAngularDir = path.join(__dirname, '..');
const ionicAngularDist = path.join(ionicAngularDir, 'dist');
const ionicAngularPkgJsonPath = path.join(ionicAngularDir, 'package.json');
const ionicAngularPkgJson = require(ionicAngularPkgJsonPath);

// make sure this local project exists
fs.emptyDirSync(prjIonicAngular);

ionicAngularPkgJson.files.push('package.json');

ionicAngularPkgJson.files.forEach(f => {
  const src = path.join(ionicAngularDir, f);
  const dest = path.join(prjIonicAngular, f);

  console.log('copying:', src, 'to', dest);
  fs.copySync(src, dest);
});

const prjReadme = path.join(prjIonicAngular, 'README.md');
fs.writeFileSync(prjReadme, '@ionic/angular copied from ' + ionicAngularDir);
