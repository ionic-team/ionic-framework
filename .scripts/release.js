/**
 * Deploy script adopted from https://github.com/sindresorhus/np
 * MIT License (c) Sindre Sorhus (sindresorhus.com)
 */
const chalk = require('chalk');
const execa = require('execa');
const Listr = require('listr');
const common = require('./common');


async function main() {
  try {
    const {version} = common.readPkg('core');

    // publish each package in NPM
    await publishPackages(common.packages, version);

    console.log(`\nionic ${version} published!! 🎉\n`);

  } catch (err) {
    console.log('\n', chalk.red(err), '\n');
    process.exit(1);
  }
}


async function publishPackages(packages, version) {
  const tasks = [];

  // repo must be clean
  common.checkGit(tasks);

  // first verify version
  packages.forEach(package => {
    if (package === 'core') return;

    const pkg = common.readPkg(package);

    tasks.push(
      {
        title: `${pkg.name}: check version (must match: ${version})`,
        task: () => {
          if (version !== pkg.version) {
            throw new Error(`${pkg.name} version ${pkg.version} must match ${version}`);
          }
        }
      }
    );
  });

  // next publish
  packages.forEach(package => {
    const pkg = common.readPkg(package);

    tasks.push(
      {
        title: `${pkg.name}: publish ${pkg.version}`,
        task: () =>execa('npm', ['publish', '--tag', 'latest'], { cwd: projectRoot })
      }
    );
  });

  // push tag to git remote
  publishGitTag(tasks, version);

  const listr = new Listr(tasks);
  await listr.run();
}


function publishGitTag(tasks, version) {
  const tag = `v${version}`;

  tasks.push(
      {
      title: `Tag latest commit ${chalk.dim(`(${tag})`)}`,
      task: () => execa('git', ['tag', `${tag}`], { cwd: common.rootDir })
    },
    {
      title: 'Push tag to Github',
      task: () => execa('git', ['push', '--follow-tags'], { cwd: common.rootDir })
    }
  );
}


main();
