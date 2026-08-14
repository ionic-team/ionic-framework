import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Raise a directly declared `@ionic/core` to v9, for a vanilla app and for a
 * framework app that pins `@ionic/core` itself and would otherwise resolve the
 * v8 build next to a v9 binding. Nothing happens when `@ionic/core` is only a
 * transitive dependency, since `createDepsMigration` skips packages the
 * manifest does not declare.
 *
 * See https://ionicframework.com/docs/updating/9-0#core
 */
export const coreDeps = createDepsMigration({
  id: 'core-deps',
  framework: 'core',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#core',
  bumps: [['@ionic/core', 9]],
});
