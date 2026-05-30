const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const cleanDirs = [
  path.join(ROOT_DIR, 'dist')
];

cleanDirs.forEach(dir => {
  fs.emptyDirSync(dir);
});
