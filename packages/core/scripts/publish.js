console.log('Publish Script Starting ...');
var fs = require('fs');
var path = require('path');


var DIST = path.join(__dirname, '../dist/collection');
var SRC = path.join(__dirname, '../src');
var INDEX_JS_DIST = path.join(DIST, 'index.js');
var INDEX_DTS_SRC = path.join(SRC, 'index.d.ts');
var INDEX_DTS_DIST = path.join(DIST, 'index.d.ts');

console.log('publish: create', INDEX_JS_DIST);
fs.writeFileSync(INDEX_JS_DIST, '');


console.log('publish: create', INDEX_DTS_DIST);
var srcIndexDTS = fs.readFileSync(INDEX_DTS_SRC, 'utf-8');
fs.writeFileSync(INDEX_DTS_DIST, srcIndexDTS);

console.log('Publish Script ... Complete');