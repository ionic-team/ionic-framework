
// copy the package.json to the directory to dist to publish it

const fs = require('fs');
const path = require('path');

const package = process.argv[2];

const srcPath = path.join(__dirname, '..', package, 'package.json');
let packageContent = fs.readFileSync(srcPath, 'utf-8');

fs.writeFileSync(path.join(__dirname, '..', package, 'dist', 'package.json'), packageContent);
