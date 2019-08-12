
// the unpkg link cannot use "latest" in the url
// so this script is to keep the link updated
// with the latest

const fs = require('fs');
const path = require('path');

let version = process.argv[2];

if (version) {
  version = '@' + version;
} else {
  version = '';
}

const srcPath = path.join(__dirname, 'cdn-loader.js');
let scriptContent = fs.readFileSync(srcPath, 'utf-8');

// https://unpkg.com/@ionic/core@latest/dist/ionic.js

scriptContent = scriptContent.replace(
  /__CDN_LOADER_URL__/g,
  'https://cdn.jsdelivr.net/npm/@ionic/core' + version
);

fs.writeFileSync(path.join(__dirname, '..', 'loader', 'cdn.js'), scriptContent);
fs.writeFileSync(path.join(__dirname, '..', 'loader', 'index.cjs.js'), scriptContent);
