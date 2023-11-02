const path = require('path');
const cwd = process.cwd();

const glob = require('glob');
const fs = require('fs-extra');

const distDir = path.join(__dirname, '../dist');

const distGeneratedNodeModules = path.join(distDir, 'node_modules');

function doGlob(globString) {
  return new Promise((resolve, reject) => {
    glob.glob(globString, (err, matches) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    })
  });
}

function getCodegenedFilesToDelete() {
  const ngFactoryGlob = path.join(distDir, '**', '*ngfactory*');
  const ngSummaryGlob = path.join(distDir, '**', '*ngsummary*');
  const promises = [];
  promises.push(doGlob(ngFactoryGlob));
  promises.push(doGlob(ngSummaryGlob));
  return Promise.all(promises).then(listOfGlobResults => {
    const deleteFilePromises = [];
    listOfGlobResults.forEach(fileMatches => {
      fileMatches.forEach(filePath => {
        deleteFilePromises.push(fs.remove(filePath));
      })
    })
    return Promise.all(deleteFilePromises);
  });
}

Promise.all([
  getCodegenedFilesToDelete(),
  fs.remove(distGeneratedNodeModules)
]);
