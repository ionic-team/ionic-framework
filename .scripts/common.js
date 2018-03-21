const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const semver = require('semver');

const rootDir = path.join(__dirname, '../');


function readPkg(project) {
  const packageJsonPath = path.join(rootDir, project, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}

function rootPath() {
  return rootDir;
}

function projectPath(project) {
  return path.join(rootDir, project);
}

async function checkGit() {
  const listr = new Listr([
    {
      title: 'Check npm version',
      skip: () => isVersionLower('6.0.0', process.version),
      task: () => execa.stdout('npm', ['version', '--json']).then(json => {
        const versions = JSON.parse(json);
        if (!satisfies(versions.npm, '>=2.15.8 <3.0.0 || >=3.10.1')) {
          throw new Error(`npm@${versions.npm} has known issues publishing when running Node.js 6. Please upgrade npm or downgrade Node and publish again. https://github.com/npm/npm/issues/5082`);
        }
      })
    },
    {
      title: 'Check current branch',
      task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
        if (branch !== 'master' && branch !== 'core') {
          throw new Error('Not on `master` or `core` branch');
        }
      })
    },
    {
      title: 'Check local working tree',
      task: () => execa.stdout('git', ['status', '--porcelain']).then(status => {
        if (status !== '') {
          throw new Error('Unclean working tree. Commit or stash changes first.');
        }
      })
    },
    {
      title: 'Check remote history',
      task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']).then(result => {
        if (result !== '0') {
          throw new Error('Remote history differs. Please pull changes.');
        }
      })
    }
  ]);
  await listr.run();
}

const satisfies = (version, range) => semver.satisfies(version, range);

const isValidVersion = input => Boolean(semver.valid(input));

const isVersionLower = (oldVersion, newVersion) => {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return semver.lt(newVersion, oldVersion);
};


module.exports = {
  isValidVersion,
  readPkg,
  rootPath,
  projectPath,
  checkGit,
};
