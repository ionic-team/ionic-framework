/**
 * Deploy script adopted from https://github.com/sindresorhus/np
 * MIT License (c) Sindre Sorhus (sindresorhus.com)
 */
const tc = require('turbocolor');
const execa = require('execa');
const Listr = require('listr');
const octokit = require('@octokit/rest')()
const common = require('./common');
const fs = require('fs-extra');


async function main() {
  try {
    if (!process.env.GH_TOKEN) {
      throw new Error('env.GH_TOKEN is undefined');
    }

    const tasks = [];
    const { version } = common.readPkg('core');
    const changelog = findChangelog();

    // repo must be clean
    common.checkGit(tasks);

    // publish each package in NPM
    publishPackages(tasks, common.packages, version);

    // push tag to git remote
    publishGit(tasks, version, changelog);

    const listr = new Listr(tasks);
    await listr.run();
    console.log(`\nionic ${version} published!! 🎉\n`);

  } catch (err) {
    console.log('\n', tc.red(err), '\n');
    process.exit(1);
  }
}


async function publishPackages(tasks, packages, version) {
  // first verify version
  packages.forEach(package => {
    if (package === 'core') {
      return;
    }

    const pkg = common.readPkg(package);
    tasks.push({
      title: `${pkg.name}: check version (must match: ${version})`,
      task: () => {
        if (version !== pkg.version) {
          throw new Error(`${pkg.name} version ${pkg.version} must match ${version}`);
        }
      }
    });
  });

  // next publish
  packages.forEach(package => {
    const pkg = common.readPkg(package);
    const projectRoot = common.projectPath(package);

    tasks.push({
      title: `${pkg.name}: publish ${pkg.version}`,
      task: () => execa('npm', ['publish', '--tag', 'latest'], { cwd: projectRoot })
    });
  });
}

function publishGit(tasks, version, changelog) {
  const tag = `v${version}`;

  tasks.push(
    {
      title: `Tag latest commit ${tc.dim(`(${tag})`)}`,
      task: () => execa('git', ['tag', `${tag}`], { cwd: common.rootDir })
    },
    {
      title: 'Push branches to remote',
      task: () => execa('git', ['push'], { cwd: common.rootDir })
    },
    {
      title: 'Push tags to remove',
      task: () => execa('git', ['push', '--tags'], { cwd: common.rootDir })
    },
    {
      title: 'Publish Github release',
      task: () => publishGithub(version, tag, changelog)
    }
  );
}

function findChangelog() {
  const lines = fs.readFileSync('CHANGELOG.md', 'utf-8').toString().split('\n');
  let start = -1;
  let end = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# [')) {
      if (start === -1) {
        start = i + 1;
      } else {
        end = i - 1;
        break;
      }
    }
  }

  if(start === -1 || end === -1) {
    throw new Error('changelog diff was not found');
  }
  return lines.slice(start, end).join('\n').trim();
}

async function publishGithub(version, tag, changelog) {
  octokit.authenticate({
    type: 'oauth',
    token: process.env.GH_TOKEN
  });

  await octokit.repos.createRelease({
    owner: 'ionic-team',
    repo: 'ionic',
    target_commitish: 'master',
    tag_name: tag,
    name: version,
    body: changelog,
  });
}

main();
