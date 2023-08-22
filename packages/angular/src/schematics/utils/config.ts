import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';

const CONFIG_PATH = 'angular.json';

// TODO(FW-2827): types

export function readConfig(host: Tree): any {
  const sourceText = host.read(CONFIG_PATH)?.toString('utf-8');
  return JSON.parse(sourceText);
}

export function writeConfig(host: Tree, config: JSON): void {
  host.overwrite(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function isAngularBrowserProject(projectConfig: any): boolean {
  if (projectConfig.projectType === 'application') {
    const buildConfig = projectConfig.architect.build;
    return buildConfig.builder === '@angular-devkit/build-angular:browser';
  }

  return false;
}

export function getDefaultAngularAppName(config: any): string {
  const projects = config.projects;
  const projectNames = Object.keys(projects);

  for (const projectName of projectNames) {
    const projectConfig = projects[projectName];
    if (isAngularBrowserProject(projectConfig)) {
      return projectName;
    }
  }

  return projectNames[0];
}

export function getAngularAppConfig(config: any, projectName: string): any | never {
  // eslint-disable-next-line no-prototype-builtins
  if (!config.projects.hasOwnProperty(projectName)) {
    throw new SchematicsException(`Could not find project: ${projectName}`);
  }

  const projectConfig = config.projects[projectName];
  if (isAngularBrowserProject(projectConfig)) {
    return projectConfig;
  }

  if (config.projectType !== 'application') {
    throw new SchematicsException(`Invalid projectType for ${projectName}: ${config.projectType}`);
  } else {
    const buildConfig = projectConfig.architect.build;
    throw new SchematicsException(`Invalid builder for ${projectName}: ${buildConfig.builder}`);
  }
}

export function addStyle(host: Tree, projectName: string, stylePath: string): void {
  const config = readConfig(host);
  const appConfig = getAngularAppConfig(config, projectName);
  appConfig.architect.build.options.styles.push({
    input: stylePath,
  });
  writeConfig(host, config);
}

export function addAsset(
  host: Tree,
  projectName: string,
  architect: string,
  asset: string | { glob: string; input: string; output: string }
): void {
  const config = readConfig(host);
  const appConfig = getAngularAppConfig(config, projectName);
  const target = appConfig.architect[architect];
  if (target) {
    target.options.assets.push(asset);
    writeConfig(host, config);
  }
}

export function addArchitectBuilder(
  host: Tree,
  projectName: string,
  builderName: string,
  builderOpts: any
): void | never {
  const config = readConfig(host);
  const appConfig = getAngularAppConfig(config, projectName);
  appConfig.architect[builderName] = builderOpts;
  writeConfig(host, config);
}

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter((path) => host.exists(path))[0];

  return path;
}

export function getWorkspace(host: Tree): WorkspaceDefinition {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return parse(content) as WorkspaceDefinition;
}
