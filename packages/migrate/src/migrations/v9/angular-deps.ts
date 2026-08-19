import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Raise the `@ionic/angular` packages to v9. (The Angular framework version
 * itself is the developer's choice via `ng update`, so it is left untouched.)
 * Bumping the Ionic packages here also closes the engine's version gate: once
 * `package.json` asks for v9, `detectFrameworks` reports v9 on a re-run and
 * applies nothing.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#angular
 */
export const angularDeps = createDepsMigration({
  id: 'angular-deps',
  framework: 'angular',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#angular',
  bumps: [
    ['@ionic/angular', 9],
    ['@ionic/angular-server', 9],
  ],
});
