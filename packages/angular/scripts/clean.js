const path = require('path');
const cwd = process.cwd();

const glob = require('glob');
const rimRaf = require('rimraf');

const distDir = path.join(cwd, 'dist');

const distGeneratedNodeModules = path.join(distDir, 'node_modules');

function rimRafAsync(dir) {
  return new Promise((resolve, reject) => {
    rimRaf(dir, {}, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    })
  });
}

function doGlob(globString) {
  return new Promise((resolve, reject) => {
    glob(globString, (err, matches) => {
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
        deleteFilePromises.push(rimRafAsync(filePath));
      })
    })
    return Promise.all(deleteFilePromises);
  });
}

const taskPromises = [];
taskPromises.push(getCodegenedFilesToDelete());
taskPromises.push(rimRafAsync(distGeneratedNodeModules));

return Promise.all(taskPromises);