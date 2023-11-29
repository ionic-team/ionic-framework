import type { Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';
import { addSymbolToNgModuleMetadata, insertImport } from '@schematics/angular/utility/ast-utils';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

/**
 * Reads file given path and returns TypeScript source file.
 */
function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
  return source;
}

/**
 * Import and add module to root app module.
 */
export function addIonicModuleImportToNgModule(host: Tree, modulePath: string): void {
  const recorder = host.beginUpdate(modulePath);
  const moduleSource = getSourceFile(host, modulePath) as any;

  const ionicModuleChange = insertImport(moduleSource, modulePath, 'IonicModule', '@ionic/angular');

  applyToUpdateRecorder(recorder, [ionicModuleChange]);

  const metadataChange = addSymbolToNgModuleMetadata(moduleSource, modulePath, 'imports', 'IonicModule.forRoot({})');

  applyToUpdateRecorder(recorder, metadataChange);

  host.commitUpdate(recorder);
}
