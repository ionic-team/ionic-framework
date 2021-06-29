const path = require('path');
const fs = require('fs');

// Test dist build:
// Double-triple check all the packages
// and files are good to go before publishing
[
  // core
  {
    files: [
      '../core/css/core.css', 
      '../core/css/core.css.map', 
      '../core/css/normalize.css', 
      '../core/css/normalize.css.map', 
      '../core/components/index.js', 
      '../core/components/index.d.ts', 
      '../core/components/package.json',
      '../core/dist/index.js', 
      '../core/dist/ionic/index.esm.js', 
    ]
  },
  // hydrate
  {
    files: [
      '../core/hydrate/index.js',
      '../core/hydrate/index.d.ts',
      '../core/hydrate/package.json'
    ]
  },
  // angular
  {
    files: [
      '../angular/dist/schematics/collection.json',
      '../angular/dist/fesm5/ionic-angular.js',
      '../angular/dist/fesm2015/ionic-angular.js',
      '../angular/dist/ionic-angular.d.ts',
      '../angular/dist/ionic-angular.metadata.json'
    ]
  },
  // angular-server
  {
    files: [
      '../packages/angular-server/dist/fesm5/ionic-angular-server.js',
      '../packages/angular-server/dist/fesm2015/ionic-angular-server.js',
      '../packages/angular-server/dist/ionic-angular-server.d.ts',
      '../packages/angular-server/dist/ionic-angular-server.metadata.json'
    ]
  },
  // react
  {
    files: ['../packages/react/dist/index.js']
  },
  // react-router
  {
    files: ['../packages/react-router/dist/index.js']
  }
].forEach(testPackage);

function testPackage(testPkg) {
  if (testPkg.packageJson) {
    const pkgDir = path.dirname(testPkg.packageJson);
    const pkgJson = require(testPkg.packageJson);

    if (!pkgJson.name) {
      throw new Error('missing package.json name: ' + testPkg.packageJson);
    }

    if (!pkgJson.main) {
      throw new Error('missing package.json main: ' + testPkg.packageJson);
    }

    const pkgPath = path.join(pkgDir, pkgJson.main);
    const pkgImport = require(pkgPath);

    if (testPkg.files) {
      if (!Array.isArray(pkgJson.files)) {
        throw new Error(testPkg.packageJson + ' missing "files" property');
      }
      testPkg.files.forEach(testPkgFile => {
        if (!pkgJson.files.includes(testPkgFile)) {
          throw new Error(testPkg.packageJson + ' missing file ' + testPkgFile);
        }

        const filePath = path.join(__dirname, pkgDir, testPkgFile);
        fs.accessSync(filePath);
      });
    }

    if (pkgJson.module) {
      const moduleIndex = path.join(__dirname, pkgDir, pkgJson.module);
      fs.accessSync(moduleIndex);
    }

    if (pkgJson.types) {
      const pkgTypes = path.join(__dirname, pkgDir, pkgJson.types);
      fs.accessSync(pkgTypes);
    }

    if (testPkg.exports) {
      testPkg.exports.forEach(exportName => {
        const m = pkgImport[exportName];
        if (!m) {
          throw new Error('export "' + exportName + '" not found in: ' + testPkg.packageJson);
        }
      });
    }
  } else if (testPkg.files) {
    testPkg.files.forEach(file => {
      const filePath = path.join(__dirname, file);
      fs.statSync(filePath);
    });
  }
}

console.log(`✅ test.dist`);
