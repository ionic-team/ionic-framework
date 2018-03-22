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

    // repo must be clean
    await common.checkGit();

    // publish each project in NPM
    await publishProjects(['core', 'angular'], version);

    // push commits and tags to git remote
    await publishGit(version);

    console.log(`\n${version} published!! 🎉\n`);
    process.exit(0);

  } catch (err) {
    console.log('\n', chalk.red(err), '\n');
    process.exit(1);
  }
}

async function publishProjects(projects, newVersion) {
  const tasks = [];
  projects.forEach((project) => {
    const {name, version} = common.readPkg(project);
    tasks.push({
      title: `Checking version of name (must match: ${version})`,
      task: () => {
        if(newVersion !== version) {
          throw new Error('version does not match');
        }
      }
    });
  });

  projects.forEach((project) => {
    const projectRoot = common.projectPath(project);
    tasks.push({
      title: `Publish (latest) ${project} (v${newVersion})`,
      task: () => execa('npm', ['publish', '--tag', 'latest'], { cwd: projectRoot })
    });
  });
  const listr = new Listr(tasks);
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
