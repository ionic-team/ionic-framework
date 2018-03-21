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
    await publishProject('core');
    await publishProject('angular');

    await publishGit();
    process.exit(0);

  } catch(err) {
    console.log('\n', chalk.red(err), '\n');
    process.exit(1);
  }
}

async function publishProject(project) {
  const projectRoot = path.join(rootDir, project);
  const pkg = readPkg(project);
  const listr = new Listr([{
    title: 'Publish ' + pkg.name,
    task: () => execa('npm', ['publish'].concat(opts.tag ? ['--tag', opts.tag] : []), { cwd: projectRoot })
  }], { showSubtasks: false });
  await listr.run();
}

async function publishGit() {
  const listr = new Listr([{
    title: 'Tagging the latest commit',
    task: () => execa('git', ['tag', `v${opts.version}`], { cwd: rootDir })
  },
  {
    title: 'Pushing to Github',
    task: () => execa('git', ['push', '--follow-tags'], { cwd: rootDir })
  }]);
  await listr.run();
}

function readPkg(project) {
  const packageJsonPath = path.join(rootDir, project, 'package.json');
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}

main();
