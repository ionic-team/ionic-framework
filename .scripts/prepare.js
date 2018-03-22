/**
 * Deploy script adopted from https://github.com/sindresorhus/np
 * MIT License (c) Sindre Sorhus (sindresorhus.com)
 */
const chalk = require('chalk');
const execa = require('execa');
const inquirer = require('inquirer');
const Listr = require('listr');
const fs = require('fs-extra');
const semver = require('semver');
const common = require('./common');
const path = require('path');


async function main() {
  try {
    await common.checkGit();

    const version = await askVersion();
    await checkTagVersion(version);

    // compiler and verify projects (read-only)
    await prepareProject('core', version);
    await prepareProject('angular', version, ['@ionic/core']);

    // writes start here
    // update package.json of each project
    await updateVersion('core', version);
    await updateVersion('angular', version);

    // generate changelog
    await generateChangeLog(version);

    process.exit(0);
  } catch(err) {
    console.log('\n', chalk.red(err), '\n');
    process.exit(1);
  }
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
  const pkg = common.readPkg('core');
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

async function prepareProject(project, version, dependencies) {
  const projectRoot = common.projectPath(project);
  const pkg = common.readPkg(project);
  const oldVersion = pkg.version;

  console.log(`\nPrepare to publish a new version of ${chalk.bold.magenta(pkg.name)} ${chalk.dim(`(${oldVersion}) => (${version})`)}\n`);

  const tasks = [
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
      task: () => fs.remove(path.join(projectRoot, 'node_modules'))
    },
    {
      title: 'Install npm dependencies',
      task: () => execa('npm', ['install'], { cwd: projectRoot }),
    }];

  if (dependencies && dependencies.length > 0) {
    tasks.push(
      {
        title: 'Linking local dependencies',
        task: () => {
          return new Listr(dependencies.map(dep => ({
            title: dep,
            task: () => execa('npm', ['link', dep], { cwd: projectRoot }),
          })));
        }
      }
    );
  }

  tasks.push(
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
      title: 'Linking',
      task: () => execa('npm', ['link'], { cwd: projectRoot })
    }
  );

  const listr = new Listr(tasks, { showSubtasks: false });
  await listr.run();
}

async function updateVersion(project, version) {
  const projectRoot = common.projectPath(project);
  const listr = new Listr([{
    title: `Updating ${project}/package.json version ${chalk.dim(`(${version})`)}`,
    task: () => execa('npm', ['version', version], { cwd: projectRoot }),
  }]);
  await listr.run();
}

async function generateChangeLog() {
  const rootDir = common.rootPath();
  const listr = new Listr([{
    title: 'Generate CHANGELOG',
    task: () => execa('npm', ['run', 'changelog'], { cwd: rootDir }),
  }]);
  await listr.run();
}


const SEMVER_INCREMENTS = ['patch', 'minor', 'major'];

const isValidVersion = input => Boolean(semver.valid(input));

const isValidVersionInput = input => SEMVER_INCREMENTS.indexOf(input) !== -1 || common.isValidVersion(input);

function getNewVersion(oldVersion, input) {
  if (!isValidVersionInput(input)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
  }

  return SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver.inc(oldVersion, input);
};

const isVersionGreater = (oldVersion, newVersion) => {
  if (!common.isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }

  return semver.gt(newVersion, oldVersion);
};


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

main();
