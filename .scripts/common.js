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
  return fs.writeFileSync(packageJsonPath, text);
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
        if (branch !== 'master') {
          throw new Error(`Not on "master" branch`);
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


function preparePackage(tasks, package, version) {
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
    projectTasks.push({
      title: `${pkg.name}: install npm dependencies`,
      task: async () => {
        await fs.remove(path.join(projectRoot, 'node_modules'))
        await execa('npm', ['i'], { cwd: projectRoot });
      }
    });
  }

  if (package !== 'docs') {
    if (package !== 'core') {
      projectTasks.push({
        title: `${pkg.name}: npm link @ionic/core`,
        task: () => execa('npm', ['link', '@ionic/core'], { cwd: projectRoot })
      });
      if (version) {
        projectTasks.push({
          title: `${pkg.name}: update ionic/core dep to ${version}`,
          task: () => {
            updateDependency(pkg, "@ionic/core", version);
            writePkg(package, pkg);
          }
        });
      }
    }

    if (version) {
      projectTasks.push({
        title: `${pkg.name}: lint`,
        task: () => execa('npm', ['run', 'lint'], { cwd: projectRoot })
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
    projectTasks.push({
      title: `${pkg.name}: npm link`,
      task: () => execa('npm', ['link'], { cwd: projectRoot })
    });
  }

  // Add project tasks
  tasks.push({
    title: `Prepare ${tc.bold(pkg.name)}`,
    task: () => new Listr(projectTasks)
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
  isValidVersion,
  isVersionGreater,
  readPkg,
  writePkg,
  rootDir,
  projectPath,
  checkGit,
  packages,
  preparePackage
};
