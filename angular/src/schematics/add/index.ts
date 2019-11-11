import { join, Path } from '@angular-devkit/core';
import { apply, chain, mergeWith, move, Rule, SchematicContext, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addModuleImportToRootModule } from './../utils/ast';
import { addArchitectBuilder, addStyle, getWorkspace, addAsset } from './../utils/config';
import { addPackageToPackageJson } from './../utils/package';
import { Schema as IonAddOptions } from './schema';

function addIonicAngularToPackageJson(): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', '@ionic/angular', 'latest');
    return host;
  };
}

function addIonicAngularToolkitToPackageJson(): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(
      host,
      'devDependencies',
      '@ionic/angular-toolkit',
      'latest'
    );
    return host;
  };
}

function addIonicAngularModuleToAppModule(projectSourceRoot): Rule {
  return (host: Tree) => {
    addModuleImportToRootModule(
      host,
      projectSourceRoot,
      'IonicModule.forRoot()',
      '@ionic/angular'
    );
    return host;
  };
}

function addIonicStyles(): Rule {
  return (host: Tree) => {
    const ionicStyles = [
      'node_modules/@ionic/angular/css/normalize.css',
      'node_modules/@ionic/angular/css/structure.css',
      'node_modules/@ionic/angular/css/typography.css',
      'node_modules/@ionic/angular/css/core.css',
      'node_modules/@ionic/angular/css/padding.css',
      'node_modules/@ionic/angular/css/float-elements.css',
      'node_modules/@ionic/angular/css/text-alignment.css',
      'node_modules/@ionic/angular/css/text-transformation.css',
      'node_modules/@ionic/angular/css/flex-utils.css',
      'src/theme/variables.css'
    ].forEach(entry => {
      addStyle(host, entry);
    });
    return host;
  };
}

function addIonicons(): Rule {
  return (host: Tree) => {
    const ioniconsGlob = {
      glob: '**/*.svg',
      input: 'node_modules/ionicons/dist/ionicons/svg',
      output: './svg'
    };
    addAsset(host, ioniconsGlob);
    return host;
  };
}

function addIonicBuilder(): Rule {
  return (host: Tree) => {
    addArchitectBuilder(host, 'ionic-cordova-serve', {
      builder: '@ionic/angular-toolkit:cordova-serve',
      options: {
        cordovaBuildTarget: 'app:ionic-cordova-build',
        devServerTarget: 'app:serve'
      },
      configurations: {
        production: {
          cordovaBuildTarget: 'app:ionic-cordova-build:production',
          devServerTarget: 'app:serve:production'
        }
      }
    });
    addArchitectBuilder(host, 'ionic-cordova-build', {
      builder: '@ionic/angular-toolkit:cordova-build',
      options: {
        browserTarget: 'app:build'
      },
      configurations: {
        production: {
          browserTarget: 'app:build:production'
        }
      }
    });
    return host;
  };
}

function installNodeDeps() {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

export default function ngAdd(options: IonAddOptions): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];
    if (project.projectType !== 'application') {
      throw new SchematicsException(
        `Ionic Add requires a project type of "application".`
      );
    }

    const sourcePath = join(project.root as Path, 'src');
    const rootTemplateSource = apply(url('./files/root'), [
      template({ ...options }),
      move(sourcePath)
    ]);
    return chain([
      // @ionic/angular
      addIonicAngularToPackageJson(),
      addIonicAngularToolkitToPackageJson(),
      addIonicAngularModuleToAppModule(sourcePath),
      addIonicBuilder(),
      addIonicStyles(),
      addIonicons(),
      mergeWith(rootTemplateSource),
      // install freshly added dependencies
      installNodeDeps()
    ]);
  };
}
