const tc = require('turbocolor');
const semver = require('semver');
const execa = require('execa');
const inquirer = require('inquirer');
const Listr = require('listr');
const fs = require('fs-extra');

const common = require('./common');

const DIST_NPM_TAG = 'dev';
const DIST_TAG = 'dev';

async function main() {
  const { packages } = common;

  const orgPkg = packages.map(package => {
    const packageJsonPath = common.packagePath(package);
    return {
      filePath: packageJsonPath,
      packageContent: fs.readFileSync(packageJsonPath, 'utf-8')
    }
  });

  try {
    const originalVersion = common.readPkg('core').version;
    const devVersion = await getDevVersion(originalVersion);

    const confirm = await askDevVersion(devVersion);
    if (!confirm) {
      console.log(``);
      return;
    }

    const tasks = [];

    await setPackageVersionChanges(packages, devVersion);

    packages.forEach(package => {
      common.prepareDevPackage(tasks, package, devVersion);
    });
    common.publishPackages(tasks, packages, devVersion, DIST_NPM_TAG);

    const listr = new Listr(tasks);
    await listr.run();

    console.log(`\nionic ${devVersion} published!! 🎉\n`);

  } catch (err) {
    console.log('\n', tc.red(err), '\n');
    process.exit(1);
  }

  orgPkg.forEach(pkg => {
    fs.writeFileSync(pkg.filePath, pkg.packageContent);
  });
}

async function askDevVersion(devVersion) {

  const prompts = [
    {
      type: 'confirm',
      name: 'confirm',
      value: true,
      message: () => {
        return `Publish the dev build ${tc.cyan(devVersion)}?`;
      }
    }
  ];

  const { confirm } = await inquirer.prompt(prompts);
  return confirm;
}

async function setPackageVersionChanges(packages, version) {
  await Promise.all(packages.map(async package => {
    if (package !== 'core') {
      const pkg = common.readPkg(package);
      common.updateDependency(pkg, '@ionic/core', version);
      common.writePkg(package, pkg);
    }
    const projectRoot = common.projectPath(package);
    await execa('npm', ['version', version], { cwd: projectRoot });
  }));
}

async function getDevVersion(originalVersion) {
  const { stdout: sha } = await execa('git', ['log', '-1', '--format=%H']);
  const shortSha = sha.substring(0, 7);
  const baseVersion = semver.inc(originalVersion, 'minor');

  const d = new Date();

  let timestamp = d.getUTCFullYear().toString();
  timestamp += (d.getUTCMonth() + 1).toString().padStart(2, '0');
  timestamp += d.getUTCDate().toString().padStart(2, '0');
  timestamp += d.getUTCHours().toString().padStart(2, '0');
  timestamp += d.getUTCMinutes().toString().padStart(2, '0');

  return `${baseVersion}-${DIST_TAG}.${timestamp}.${shortSha}`;
}

main();
