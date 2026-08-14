import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Raise the Vue Ionic packages to v9, Vue Router to v5, and Vue to 3.5+ (the
 * minimum v9 supports). Vue Router 5 is a transition release with no runtime
 * breaking changes, so the dep bump is the only required change. Guard
 * migrations are reported by `vue-router-next-guard`.
 *
 * See https://ionicframework.com/docs/updating/9-0#vue
 */
export const vueDeps = createDepsMigration({
  id: 'vue-deps',
  framework: 'vue',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#vue',
  bumps: [
    ['@ionic/vue', 9],
    ['@ionic/vue-router', 9],
    ['vue', '^3.5.0'],
    ['vue-router', 5],
  ],
});
