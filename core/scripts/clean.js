const fs = require('fs-extra');
const path = require('path');


const cleanDirs = [
  'dist',
  'css',
  '.stencil'
];

cleanDirs.forEach(dir => {
  const cleanDir = path.join(__dirname, '../', dir);
  fs.removeSync(cleanDir);
});
