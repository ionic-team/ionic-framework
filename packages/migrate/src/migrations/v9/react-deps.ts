import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Raise the React Ionic packages to v9 and React Router to v6, and drop the
 * now-bundled `@types/react-router*`. The accompanying code changes (Route
 * `element`, `useNavigate`, etc.) are reported by `react-router-6-code`.
 *
 * See https://ionicframework.com/docs/updating/9-0#react
 */
export const reactDeps = createDepsMigration({
  id: 'react-deps',
  framework: 'react',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#react',
  bumps: [
    ['@ionic/react', 9],
    ['@ionic/react-router', 9],
    ['react-router', 6],
    ['react-router-dom', 6],
  ],
  removes: ['@types/react-router', '@types/react-router-dom'],
});
