const fs = require('fs-extra');
const path = require('path');

// Export types for the custom elements bundle
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'types', 'custom-elements.d.ts'), `
export * from './index';
export * from './interface';
`.trim());
