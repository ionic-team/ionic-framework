const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const semver = require('semver');
const tc = require('turbocolor');

const rootDir = path.join(__dirname, '../');

const packages = [
  'core',
  'docs',
  'angular',
];

function readPkg(project) {
  const packageJsonPath = packagePath(project);
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
}

function writePkg(project, pkg) {
  const packageJsonPath = packagePath(project);
  const text = JSON.stringify(pkg, null, 2);
  return fs.writeFileSync(packageJsonPath, `${text}\n`);
}

function packagePath(project) {
  return path.join(rootDir, project, 'package.json');
}

function projectPath(project) {
  return path.join(rootDir, project);
}

function checkGit(tasks) {
  tasks.push(
    {
      title: 'Check current branch',
      task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD']).then(branch => {
        if (branch.indexOf('release') === -1 && branch.indexOf('hotfix') === -1) {
          throw new Error(`Must be on a "release" or "hotfix" branch.`);
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


function preparePackage(tasks, package, version, install) {
  const projectRoot = projectPath(package);
  const pkg = readPkg(package);

  const projectTasks = [];
  if (version) {
    projectTasks.push({
      title: `${pkg.name}: validate new version`,
      task: () => {
        if (!isVersionGreater(pkg.version, version)) {
          throw new Error(`New version \`${version}\` should be higher than current version \`${pkg.version}\``);
        }
      }
    });
    if (install) {
      projectTasks.push({
        title: `${pkg.name}: install npm dependencies`,
        task: async () => {
          await fs.remove(path.join(projectRoot, 'node_modules'))
          await execa('npm', ['i'], { cwd: projectRoot });
        }
      });
    }
  }

  if (package !== 'docs') {
    if (package !== 'core') {
      projectTasks.push({
        title: `${pkg.name}: npm link @ionic/core`,
        task: () => execa('npm', ['link', '@ionic/core'], { cwd: projectRoot })
      });
    }

    if (version) {
      projectTasks.push({
        title: `${pkg.name}: lint`,
        task: () => execa('npm', ['run', 'lint'], { cwd: projectRoot })
      });
      projectTasks.push({
        title: `${pkg.name}: update ionic/core dep to ${version}`,
        task: () => {
          updateDependency(pkg, "@ionic/core", version);
          writePkg(package, pkg);
        }
      });
      projectTasks.push({
        title: `${pkg.name}: test`,
        task: () => execa('npm', ['test'], { cwd: projectRoot })
      });
    }

    projectTasks.push({
      title: `${pkg.name}: build`,
      task: () => execa('npm', ['run', 'build'], { cwd: projectRoot })
    });
    if (package === 'core') {
      projectTasks.push({
        title: `${pkg.name}: npm link`,
        task: () => execa('npm', ['link'], { cwd: projectRoot })
      });
    }
  }

  // Add project tasks
  tasks.push({
    title: `Prepare ${tc.bold(pkg.name)}`,
    task: () => new Listr(projectTasks)
  });
}


function prepareDevPackage(tasks, package, version) {
  const projectRoot = projectPath(package);
  const pkg = readPkg(package);

  const projectTasks = [];

  if (package !== 'docs') {
    if (package !== 'core') {
      projectTasks.push({
        title: `${pkg.name}: npm link @ionic/core`,
        task: () => execa('npm', ['link', '@ionic/core'], { cwd: projectRoot })
      });
    }

    projectTasks.push({
      title: `${pkg.name}: update ionic/core dep to ${version}`,
      task: () => {
        updateDependency(pkg, "@ionic/core", version);
        writePkg(package, pkg);
      }
    });

    projectTasks.push({
      title: `${pkg.name}: build`,
      task: () => execa('npm', ['run', 'build'], { cwd: projectRoot })
    });

    if (package === 'core') {
      projectTasks.push({
        title: `${pkg.name}: npm link`,
        task: () => execa('npm', ['link'], { cwd: projectRoot })
      });
    }
  }

  // Add project tasks
  tasks.push({
    title: `Prepare dev build: ${tc.bold(pkg.name)}`,
    task: () => new Listr(projectTasks)
  });
}

function updatePackageVersions(tasks, packages, version) {
  packages.forEach(package => {
    updatePackageVersion(tasks, package, version);

    tasks.push(
      {
        title: `${package} update @ionic/core dependency, if present ${tc.dim(`(${version})`)}`,
        task: async () => {
          if (package !== 'core') {
            const pkg = readPkg(package);
            updateDependency(pkg, '@ionic/core', version);
            writePkg(package, pkg);
          }
        },
      }
    )
  });
}


function updatePackageVersion(tasks, package, version) {
  const projectRoot = projectPath(package);

  tasks.push(
    {
      title: `${package}: update package.json ${tc.dim(`(${version})`)}`,
      task: async () => {
        await execa('npm', ['version', version], { cwd: projectRoot });
      }
    }
  );
}

function publishPackages(tasks, packages, version, tag = 'latest') {
  // first verify version
  packages.forEach(package => {
    if (package === 'core') {
      return;
    }

    tasks.push({
      title: `${package}: check version (must match: ${version})`,
      task: () => {
        const pkg = readPkg(package);

        if (version !== pkg.version) {
          throw new Error(`${pkg.name} version ${pkg.version} must match ${version}`);
        }
      }
    });
  });

  // next publish
  packages.forEach(package => {
    const projectRoot = projectPath(package);

    tasks.push({
      title: `${package}: publish to ${tag} tag`,
      task: async () => {
        await execa('npm', ['publish', '--tag', tag], { cwd: projectRoot });
      },
    });
  });
}

function updateDependency(pkg, dependency, version) {
  if (pkg.dependencies && pkg.dependencies[dependency]) {
    pkg.dependencies[dependency] = version;
  }
  if (pkg.devDependencies && pkg.devDependencies[dependency]) {
    pkg.devDependencies[dependency] = version;
  }
}

function isVersionGreater(oldVersion, newVersion) {
  if (!isValidVersion(newVersion)) {
    throw new Error('Version should be a valid semver version.');
  }
  return true;
}


module.exports = {
  checkGit,
  isValidVersion,
  isVersionGreater,
  packages,
  packagePath,
  prepareDevPackage,
  preparePackage,
  projectPath,
  publishPackages,
  readPkg,
  rootDir,
  updateDependency,
  updatePackageVersion,
  updatePackageVersions,
  writePkg,
};
