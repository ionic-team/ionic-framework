import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Ionic 9 requires TypeScript 5.4 or later. `@ionic/react`'s published types use
 * `NoInfer`, which TypeScript added in 5.4. A higher pin is left alone.
 *
 * Pinned with a caret, unlike the tilde `angular-typescript` uses: React has no
 * narrow peer range to satisfy, so any later 5.x is fine.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#react-typescript
 */
export const reactTypescript = createDepsMigration({
  id: 'react-typescript',
  framework: 'react',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#react-typescript',
  bumps: [['typescript', '^5.4.0']],
});
