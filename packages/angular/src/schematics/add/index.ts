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
import { addRootProvider } from '@schematics/angular/utility';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { addIonicModuleImportToNgModule } from '../utils/ast';

import {
  addArchitectBuilder,
  addAsset,
  addCli,
  addSchematics,
  addStyle,
  getDefaultAngularAppName,
} from './../utils/config';
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

/**
 * Adds the @ionic/angular-toolkit schematics and cli configuration to the project's `angular.json` file.
 * @param projectName The name of the project.
 */
function addIonicAngularToolkitToAngularJson(): Rule {
  return (host: Tree) => {
    addCli(host, '@ionic/angular-toolkit');
    addSchematics(host, '@ionic/angular-toolkit:component', {
      styleext: 'scss',
    });
    addSchematics(host, '@ionic/angular-toolkit:page', {
      styleext: 'scss',
    });
    return host;
  };
}

/**
 * Adds the `IonicModule.forRoot()` usage to the project's `AppModule`.
 * If the project does not use modules this will operate as a noop.
 * @param projectSourceRoot The source root path of the project.
 */
function addIonicAngularModuleToAppModule(projectSourceRoot: Path): Rule {
  return (host: Tree) => {
    const appModulePath = `${projectSourceRoot}/app/app.module.ts`;
    if (host.exists(appModulePath)) {
      addIonicModuleImportToNgModule(host, appModulePath);
    }
    return host;
  };
}

/**
 * Adds the `provideIonicAngular` usage to the project's app config.
 * If the project does not use an app config this will operate as a noop.
 * @param projectName The name of the project.
 * @param projectSourceRoot The source root path of the project.
 */
function addProvideIonicAngular(projectName: string, projectSourceRoot: Path): Rule {
  return (host: Tree) => {
    const appConfig = `${projectSourceRoot}/app/app.config.ts`;
    if (host.exists(appConfig)) {
      return addRootProvider(
        projectName,
        ({ code, external }) => code`${external('provideIonicAngular', '@ionic/angular/standalone')}({})`
      );
    }
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

function addIonicons(projectName: string, projectSourceRoot: Path): Rule {
  return (host: Tree) => {
    const hasAppModule = host.exists(`${projectSourceRoot}/app/app.module.ts`);

    if (hasAppModule) {
      /**
       * Add Ionicons to the `angular.json` file only if the project
       * is using the lazy build of `@ionic/angular` with modules.
       */
      const ioniconsGlob = {
        glob: '**/*.svg',
        input: 'node_modules/ionicons/dist/ionicons/svg',
        output: './svg',
      };
      addAsset(host, projectName, 'build', ioniconsGlob);
      addAsset(host, projectName, 'test', ioniconsGlob);
    }

    return host;
  };
}

function addIonicConfig(): Rule {
  return (host: Tree) => {
    const ionicConfig = 'ionic.config.json';
    if (!host.exists(ionicConfig)) {
      host.create(
        ionicConfig,
        JSON.stringify(
          {
            name: 'ionic-app',
            app_id: '',
            type: 'angular',
            integrations: {},
          },
          null,
          2
        )
      );
    }
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
      addIonicAngularToolkitToAngularJson(),
      addIonicAngularModuleToAppModule(sourcePath),
      addProvideIonicAngular(options.project, sourcePath),
      addIonicBuilder(options.project),
      addIonicStyles(options.project, sourcePath),
      addIonicons(options.project, sourcePath),
      addIonicConfig(),
      mergeWith(rootTemplateSource),
      // install freshly added dependencies
      installNodeDeps(),
    ]);
  };
}
