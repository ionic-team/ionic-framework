'use strict';

const path = require('path');

// Register TS compilation.
require('ts-node').register({
  project: path.join(__dirname, 'scripts/gulp')
});

require('./scripts/gulp/gulpfile');
