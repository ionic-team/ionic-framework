const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');

const dir = path.resolve(__dirname, '..', 'dist', 'types');

// Export types for the custom elements bundle
mkdirp.sync(dir);
fs.writeFileSync(path.join(dir, 'custom-elements.d.ts'), `
export * from './index';
export * from './interface';
`.trim());
