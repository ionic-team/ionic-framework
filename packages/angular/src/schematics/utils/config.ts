import type { JsonObject } from '@angular-devkit/core';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import type { SchematicOptions } from '@angular/cli/lib/config/workspace-schema';
import { parse } from 'jsonc-parser';

const ANGULAR_JSON_PATH = 'angular.json';

export function readConfig<T extends JsonObject = JsonObject>(host: Tree): T {
  return host.readJson(ANGULAR_JSON_PATH) as T;
}

export function writeConfig(host: Tree, config: JsonObject): void {
  host.overwrite(ANGULAR_JSON_PATH, JSON.stringify(config, null, 2));
}

function isAngularBrowserProject(projectConfig: any): boolean {
  if (projectConfig.projectType === 'application') {
    const buildConfig = projectConfig.architect.build;
    // Angular 16 and lower
    const legacyAngularBuilder = buildConfig.builder === '@angular-devkit/build-angular:browser';
    // Angular 17+
    const modernAngularBuilder = buildConfig.builder === '@angular-devkit/build-angular:application';

    return legacyAngularBuilder || modernAngularBuilder;
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

function getAngularJson(config: any, projectName: string): any | never {
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
  const angularJson = getAngularJson(config, projectName);
  angularJson.architect.build.options.styles.push({
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
  const angularJson = getAngularJson(config, projectName);
  const target = angularJson.architect[architect];
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
  const angularJson = getAngularJson(config, projectName);
  angularJson.architect[builderName] = builderOpts;
  writeConfig(host, config);
}

/**
 * Updates the angular.json to add an additional schematic collection
 * to the CLI configuration.
 */
export function addCli(host: Tree, collectionName: string): void | never {
  const angularJson = readConfig<any>(host);

  if (angularJson.cli === undefined) {
    angularJson.cli = {};
  }

  if (angularJson.cli.schematicCollections === undefined) {
    angularJson.cli.schematicCollections = [];
  }

  angularJson.cli.schematicCollections.push(collectionName);

  writeConfig(host, angularJson);
}

// TODO(FW-5639): can remove [property: string]: any; when upgrading @angular/cli dev-dep to v16 or later
export function addSchematics(
  host: Tree,
  schematicName: string,
  schematicOpts: SchematicOptions
): void | never {
  const angularJson = readConfig<any>(host);

  if (angularJson.schematics === undefined) {
    angularJson.schematics = {};
  }

  angularJson.schematics[schematicName] = schematicOpts;

  writeConfig(host, angularJson);
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
