const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const cleanDirs = [
  path.join(ROOT_DIR, 'dist'),
  path.join(ROOT_DIR, 'server')
];

cleanDirs.forEach(dir => {
  fs.emptyDirSync(dir);
});

const serverPackageSrc = path.join(ROOT_DIR, 'src', 'server', 'package.json');
const serverPackageDst = path.join(ROOT_DIR, 'server', 'package.json');
fs.copyFileSync(serverPackageSrc, serverPackageDst);
