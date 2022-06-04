import { Path, join } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  SchematicsException,
  template,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { addModuleImportToRootModule } from './../utils/ast';
import { addArchitectBuilder, addAsset, addStyle, getDefaultAngularAppName } from './../utils/config';
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
    addPackageToPackageJson(host, 'devDependencies', '@ionic/angular-toolkit', 'latest');
    return host;
  };
}

function addIonicAngularModuleToAppModule(projectSourceRoot: Path): Rule {
  return (host: Tree) => {
    addModuleImportToRootModule(host, projectSourceRoot, 'IonicModule.forRoot()', '@ionic/angular');
    return host;
  };
}

function addIonicStyles(projectName: string, projectSourceRoot: Path): Rule {
  return (host: Tree) => {
    const ionicStyles = [
      'node_modules/@ionic/angular/css/core.css',
      'node_modules/@ionic/angular/css/normalize.css',
      'node_modules/@ionic/angular/css/structure.css',
      'node_modules/@ionic/angular/css/typography.css',
      'node_modules/@ionic/angular/css/display.css',
      'node_modules/@ionic/angular/css/padding.css',
      'node_modules/@ionic/angular/css/float-elements.css',
      'node_modules/@ionic/angular/css/text-alignment.css',
      'node_modules/@ionic/angular/css/text-transformation.css',
      'node_modules/@ionic/angular/css/flex-utils.css',
      `${projectSourceRoot}/theme/variables.css`,
    ];

    ionicStyles.forEach((entry) => {
      addStyle(host, projectName, entry);
    });
    return host;
  };
}

function addIonicons(projectName: string): Rule {
  return (host: Tree) => {
    const ioniconsGlob = {
      glob: '**/*.svg',
      input: 'node_modules/ionicons/dist/ionicons/svg',
      output: './svg',
    };
    addAsset(host, projectName, 'build', ioniconsGlob);
    addAsset(host, projectName, 'test', ioniconsGlob);
    return host;
  };
}

function addIonicBuilder(projectName: string): Rule {
  return (host: Tree) => {
    addArchitectBuilder(host, projectName, 'ionic-cordova-serve', {
      builder: '@ionic/angular-toolkit:cordova-serve',
      options: {
        cordovaBuildTarget: `${projectName}:ionic-cordova-build`,
        devServerTarget: `${projectName}:serve`,
      },
      configurations: {
        production: {
          cordovaBuildTarget: `${projectName}:ionic-cordova-build:production`,
          devServerTarget: `${projectName}:serve:production`,
        },
      },
    });
    addArchitectBuilder(host, projectName, 'ionic-cordova-build', {
      builder: '@ionic/angular-toolkit:cordova-build',
      options: {
        browserTarget: `${projectName}:build`,
      },
      configurations: {
        production: {
          browserTarget: `${projectName}:build:production`,
        },
      },
    });
    return host;
  };
}

function installNodeDeps() {
  return (_host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}

export default function ngAdd(options: IonAddOptions): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    if (!options.project) {
      options.project = getDefaultAngularAppName(workspace);
    }
    const project = workspace.projects.get(options.project);

    if (!project || project.extensions.projectType !== 'application') {
      throw new SchematicsException(`Ionic Add requires a project type of "application".`);
    }
    const sourcePath: Path = join(project.sourceRoot as Path);
    const rootTemplateSource = apply(url('./files/root'), [template({ ...options }), move(sourcePath)]);
    return chain([
      // @ionic/angular
      addIonicAngularToPackageJson(),
      addIonicAngularToolkitToPackageJson(),
      addIonicAngularModuleToAppModule(sourcePath),
      addIonicBuilder(options.project),
      addIonicStyles(options.project, sourcePath),
      addIonicons(options.project),
      mergeWith(rootTemplateSource),
      // install freshly added dependencies
      installNodeDeps(),
    ]);
  };
}
