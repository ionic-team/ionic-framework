import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Ionic 9 requires TypeScript 5.4 or later, matching Angular 18's own minimum.
 * A higher pin is left alone (Angular 21 wants 5.9, Angular 22 wants 6.0).
 *
 * Pinned with a tilde: Angular's peer ranges are narrow (18 accepts `>=5.4 <5.6`),
 * and `^5.4.0` resolves to 5.9.x, which nothing below Angular 20 accepts.
 *
 * See https://ionicframework.com/docs/updating/9-0#typescript
 */
export const angularTypescript = createDepsMigration({
  id: 'angular-typescript',
  framework: 'angular',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#typescript',
  bumps: [['typescript', '~5.4.0']],
});
