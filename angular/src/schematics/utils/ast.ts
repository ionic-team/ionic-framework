import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import * as ts from 'typescript';
import { addImportToModule } from './devkit-utils/ast-utils';
import { InsertChange } from './devkit-utils/change';

/**
 * Reads file given path and returns TypeScript source file.
 */
export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  return source;
}

/**
 * Import and add module to root app module.
 */
export function addModuleImportToRootModule(
  host: Tree,
  projectSourceRoot,
  moduleName: string,
  importSrc: string
) {
  addModuleImportToModule(
    host,
    normalize(`${projectSourceRoot}/app/app.module.ts`),
    moduleName,
    importSrc
  );
}

/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
export function addModuleImportToModule(
  host: Tree,
  modulePath: string,
  moduleName: string,
  src: string
) {
  const moduleSource = getSourceFile(host, modulePath);
  const changes = addImportToModule(moduleSource, modulePath, moduleName, src);
  const recorder = host.beginUpdate(modulePath);

  changes.forEach(change => {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });

  host.commitUpdate(recorder);
}
