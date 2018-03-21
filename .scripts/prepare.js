/**
 * Deploy script adopted from https://github.com/sindresorhus/np
 * MIT License (c) Sindre Sorhus (sindresorhus.com)
 */
const chalk = require('chalk');
const execa = require('execa');
const inquirer = require('inquirer');
const Listr = require('listr');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const rootDir = path.join(__dirname, '../');

async function main() {
  try {
    await checkGit();

    const version = await askVersion();
    await checkTagVersion(version);
    await prepareProject('core', version);
    await link('core', 'angular');
    await prepareProject('angular', version);

    await generateChangeLog(version);
    process.exit(0);
  } catch(err) {
    console.log('\n', chalk.red(err), '\n');
    process.exit(1);
  }
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

async function checkTagVersion(version) {
  const listr = new Listr([
    {
      title: 'Check git tag existence',
      task: () => execa('git', ['fetch'])
        .then(() => {
          return execa.stdout('npm', ['config', 'get', 'tag-version-prefix']);
        })
        .then(
          output => {
            tagPrefix = output;
          },
          () => {}
        )
        .then(() => execa.stdout('git', ['rev-parse', '--quiet', '--verify', `refs/tags/${tagPrefix}${version}`]))
        .then(
          output => {
            if (output) {
              throw new Error(`Git tag \`${tagPrefix}${version}\` already exists.`);
            }
          },
          err => {
            // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
            // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
            if (err.stdout !== '' || err.stderr !== '') {
              throw err;
            }
          }
        )
    },
  ]);
  await listr.run();
}


async function askVersion() {
  const pkg = readPkg('core');
  const oldVersion = pkg.version;

  const prompts = [
    {
      type: 'list',
      name: 'version',
      message: 'Select semver increment or specify new version',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: SEMVER_INCREMENTS
        .map(inc => ({
          name: `${inc}   ${prettyVersionDiff(oldVersion, inc)}`,
          value: inc
        }))
        .concat([
          new inquirer.Separator(),
          {
            name: 'Other (specify)',
            value: null
          }
        ]),
      filter: input => isValidVersionInput(input) ? getNewVersion(oldVersion, input) : input
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version',
      when: answers => !answers.version,
      filter: input => isValidVersionInput(input) ? getNewVersion(pkg.version, input) : input,
      validate: input => {
        if (!isValidVersionInput(input)) {
          return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
        } else if (!isVersionGreater(oldVersion, input)) {
          return `Version must be greater than ${oldVersion}`;
        }

        return true;
      }
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: answers => {
        return `Will bump from ${chalk.cyan(oldVersion)} to ${chalk.cyan(answers.version)}. Continue?`;
      }
    }
  ];

  const {version} = await inquirer.prompt(prompts);
  return version;
}

async function prepareProject(project, version) {
  const projectRoot = path.join(rootDir, project);
  const pkg = readPkg(project);
  const oldVersion = pkg.version;

  console.log(`\nPrepare to publish a new version of ${chalk.bold.magenta(pkg.name)} ${chalk.dim(`(${oldVersion})`)}\n`);


  const listr = new Listr([
    {
      title: 'Validate version',
      task: () => {
        if (!isVersionGreater(pkg.version, version)) {
          throw new Error(`New version \`${newVersion}\` should be higher than current version \`${pkg.version}\``);
        }
      }
    },
    {
      title: 'Cleanup',
      task: () => fs.remove('node_modules')
    },
    {
      title: 'Install npm dependencies',
      task: () => execa('npm', ['install'], { cwd: projectRoot }),
    },
    {
      title: 'Run lint',
      task: () => execa('npm', ['run', 'lint'], { cwd: projectRoot })
    },
    {
      title: 'Build ' + pkg.name,
      task: () => execa('npm', ['run', 'build'], { cwd: projectRoot })
    },
    {
      title: 'Run tests',
      task: () => execa('npm', ['test'], { cwd: projectRoot })
    },
    {
      title: 'Set package.json version',
      task: () => execa('npm', ['version', version], { cwd: projectRoot }),
    },
  ], { showSubtasks: false });
  await listr.run();
}


async function generateChangeLog() {
  const listr = new Listr([{
    title: 'Generate CHANGELOG',
    task: () => execa('npm', ['run', 'changelog'], { cwd: rootDir }),
  }]);
  await listr.run();
}


const SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
const PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];

const isValidVersion = input => Boolean(semver.valid(input));

const isValidVersionInput = input => SEMVER_INCREMENTS.indexOf(input) !== -1 || isValidVersion(input);

const isPrereleaseVersion = version => PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver.prerelease(version));

function getNewVersion(oldVersion, input) {
  if (!isValidVersionInput(input)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
  }

  return SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver.inc(oldVersion, input);
};

const isVersionGreater = (oldVersion, newVersion) => {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return semver.gt(newVersion, oldVersion);
};

const isVersionLower = (oldVersion, newVersion) => {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return semver.lt(newVersion, oldVersion);
};

const satisfies = (version, range) => semver.satisfies(version, range);


function prettyVersionDiff(oldVersion, inc) {
  const newVersion = getNewVersion(oldVersion, inc).split('.');
  oldVersion = oldVersion.split('.');
  let firstVersionChange = false;
  const output = [];

  for (let i = 0; i < newVersion.length; i++) {
    if ((newVersion[i] !== oldVersion[i] && !firstVersionChange)) {
      output.push(`${chalk.dim.cyan(newVersion[i])}`);
      firstVersionChange = true;
    } else if (newVersion[i].indexOf('-') >= 1) {
      let preVersion = [];
      preVersion = newVersion[i].split('-');
      output.push(`${chalk.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
    } else {
      output.push(chalk.reset.dim(newVersion[i]));
    }
  }
  return output.join(chalk.reset.dim('.'));
}


function readPkg(project) {
  const packageJsonPath = path.join(rootDir, project, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}


main();
