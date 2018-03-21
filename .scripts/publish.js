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

    await common.checkGit();

    await publishProject('core', version);
    await publishProject('angular', version);

    await publishGit(version);
    process.exit(0);

  } catch (err) {
    console.log('\n', chalk.red(err), '\n');
    process.exit(1);
  }
}

async function publishProject(project, version) {
  const projectRoot = common.projectPath(project);
  const listr = new Listr([{
    title: `Publish (latest) ${project} (v${version})`,
    task: () => execa('npm', ['publish', '--tag', 'latest'], { cwd: projectRoot })
  }], { showSubtasks: false });
  await listr.run();
}

async function publishGit(version) {
  const rootDir = common.rootPath();
  const listr = new Listr([{
    title: 'Tagging the latest commit',
    task: () => execa('git', ['tag', `v${version}`], { cwd: rootDir })
  },
  {
    title: 'Pushing to Github',
    task: () => execa('git', ['push', '--follow-tags'], { cwd: rootDir })
  }]);
  await listr.run();
}

main();
