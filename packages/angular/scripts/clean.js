const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

fs.removeSync(path.join(ROOT_DIR, 'css'));
fs.removeSync(path.join(ROOT_DIR, 'dist'));
