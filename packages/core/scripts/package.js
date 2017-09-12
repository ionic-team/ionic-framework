var fs = require('fs');
var path = require('path');


var DIST = path.join(__dirname, '../dist/collection');
var SRC = path.join(__dirname, '../src');
var INDEX_JS_DIST = path.join(DIST, 'index.js');
var INDEX_DTS_SRC = path.join(SRC, 'index.d.ts');
var INDEX_DTS_DIST = path.join(DIST, 'index.d.ts');
var PACKAGE_JSON_SRC = path.join(__dirname, '../package.json');
var PACKAGE_JSON_DIST = path.join(__dirname, '../dist/package.json');
var README_SRC = path.join(__dirname, '../README.md');
var README_DIST = path.join(__dirname, '../dist/README.md');
var LICENSE_SRC = path.join(__dirname, '../LICENSE');
var LICENSE_DIST = path.join(__dirname, '../dist/LICENSE');

fs.writeFileSync(INDEX_JS_DIST, '');


var srcIndexDTS = fs.readFileSync(INDEX_DTS_SRC, 'utf-8');
fs.writeFileSync(INDEX_DTS_DIST, srcIndexDTS);

var packageJsonSrc = require(PACKAGE_JSON_SRC);

var packageJsonDist = {
  "name": packageJsonSrc.name,
  "version": packageJsonSrc.version,
  "description": packageJsonSrc.description,
  "license": packageJsonSrc.license,
  "author": packageJsonSrc.author,
  "repository": packageJsonSrc.repository,
  "bugs": packageJsonSrc.bugs,
  "homepage": packageJsonSrc.homepage,

  "browser": "ionic.js",
  "main": "collection/index.js",
  "types": "collection/index.d.ts",
  "collection": "collection/collection-manifest.json",
  "files": [
    "collection/",
    "ionic/",
    "ionic.js",
    "ionic.registry.json",
    "README.md",
    "LICENSE"
  ]
};

fs.writeFileSync(PACKAGE_JSON_DIST, JSON.stringify(packageJsonDist, null, 2));

fs.writeFileSync(README_DIST, fs.readFileSync(README_SRC, 'utf-8'));

fs.writeFileSync(LICENSE_DIST, fs.readFileSync(LICENSE_SRC, 'utf-8'));
