const fs = require('fs-extra');
const path = require('path');


let prjDir = process.argv[2];
if (!prjDir) {
  throw new Error('local path required as last argument to "npm run build.link" command');
}
prjDir = path.join(__dirname, '../../../', prjDir);

copyPackage(prjDir, 'angular');
copyPackage(prjDir, 'core');


function copyPackage(prjDir, pkgName) {
  const prjDest = path.join(prjDir, 'node_modules', '@ionic', pkgName);

  const pkgSrcDir = path.join(__dirname, '..', '..', pkgName);
  const pkgSrcDist = path.join(pkgSrcDir, 'dist');
  const pkgJsonPath = path.join(pkgSrcDir, 'package.json');
  const pkgJson = require(pkgJsonPath);

  // make sure this local project exists
  fs.emptyDirSync(prjDest);

  pkgJson.files.push('package.json');

  pkgJson.files.forEach(f => {
    const src = path.join(pkgSrcDir, f);
    const dest = path.join(prjDest, f);

    console.log('copying:', src, 'to', dest);
    fs.copySync(src, dest);
  });

  const prjReadme = path.join(prjDest, 'README.md');
  console.log('readme:', prjReadme);

  fs.writeFileSync(prjReadme, '@ionic/' + pkgName + ' copied from ' + pkgSrcDir + ', ' + new Date());
}
