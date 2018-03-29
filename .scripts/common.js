const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const semver = require('semver');

const rootDir = path.join(__dirname, '../');

const packages = [
  'core',
  'angular'
];

function readPkg(package) {
  const packageJsonPath = path.join(rootDir, package, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}

function projectPath(project) {
  return path.join(rootDir, project);
}

function checkGit(tasks) {
  tasks.push(
    {
      title: 'Check current branch',
      task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
        if (branch !== 'master') {
          throw new Error(`Not on "master" branch`);
        }
      })
    },
    {
      title: 'Check local working tree',
      task: () => execa.stdout('git', ['status', '--porcelain']).then(status => {
        if (status !== '') {
          throw new Error(`Unclean working tree. Commit or stash changes first.`);
        }
      })
    },
    {
      title: 'Check remote history',
      task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
        if (result !== '0') {
          throw new Error(`Remote history differs. Please pull changes.`);
        }
      })
    }
  );
}

const isValidVersion = input => Boolean(semver.valid(input));


module.exports = {
  isValidVersion,
  readPkg,
  rootDir,
  projectPath,
  checkGit,
  packages
};
