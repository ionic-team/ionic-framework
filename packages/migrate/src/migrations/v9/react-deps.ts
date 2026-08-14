import { createDepsMigration } from '../../ast/deps-migration.js';

/**
 * Raise the React Ionic packages to v9, React to 18, and React Router to v6,
 * dropping the now-bundled `@types/react-router*`. The accompanying code
 * changes (Route `element`, `useNavigate`, etc.) are reported by
 * `react-router-6-code`.
 *
 * React is raised only to the 18 floor v9 requires; a newer major is the app's
 * call.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#react
 */
export const reactDeps = createDepsMigration({
  id: 'react-deps',
  framework: 'react',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#react',
  bumps: [
    ['@ionic/react', 9],
    ['@ionic/react-router', 9],
    ['react', 18],
    ['react-dom', 18],
    // The types have to move with the runtime, or the reinstall at the end of
    // the run leaves React 18 type-checked against React 17 definitions.
    ['@types/react', 18],
    ['@types/react-dom', 18],
    ['react-router', 6],
    ['react-router-dom', 6],
  ],
  removes: ['@types/react-router', '@types/react-router-dom'],
});
