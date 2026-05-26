const path = require('path');

const { glob } = require('glob');
const fs = require('fs-extra');

const distDir = path.join(__dirname, '../dist');

const distGeneratedNodeModules = path.join(distDir, 'node_modules');

async function getCodegenedFilesToDelete() {
  const ngFactoryGlob = path.join(distDir, '**', '*ngfactory*');
  const ngSummaryGlob = path.join(distDir, '**', '*ngsummary*');
  const [factoryMatches, summaryMatches] = await Promise.all([glob(ngFactoryGlob), glob(ngSummaryGlob)]);
  return Promise.all([...factoryMatches, ...summaryMatches].map((filePath) => fs.remove(filePath)));
}

Promise.all([getCodegenedFilesToDelete(), fs.remove(distGeneratedNodeModules)]);
