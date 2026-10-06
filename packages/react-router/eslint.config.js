const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// The React Router 7 typecheck only remaps `react-router-dom`, so a `react-router` import would skip it.
const noReactRouterImport = [
  'error',
  {
    patterns: [
      {
        group: ['react-router', 'react-router/*'],
        message: 'Import from react-router-dom instead, so tsconfig.rr7.json remaps it to React Router 7.',
      },
    ],
  },
];

/*
  The shared @ionic/eslint-config is still authored in eslintrc format, so the
  previous config is bridged through FlatCompat. Everything is scoped to TS
  files to match the previous `eslint src --ext .ts` behavior and keep the
  TypeScript parser off plain JS files like this config.
*/
module.exports = [
  {
    ignores: ['dist/**', 'build/**'],
  },
  ...compat
    .config({
      env: {
        browser: true,
        es6: true,
        node: true,
      },
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', '@ionic/eslint-config/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        'no-restricted-imports': noReactRouterImport,
      },
    })
    .map((config) => ({ ...config, files: ['src/**/*.ts', 'src/**/*.tsx'] })),
  // The type-aware config above can't parse `type-tests/`, which only compiles under `tsconfig.rr7.json`.
  {
    files: ['type-tests/**/*.ts', 'type-tests/**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      sourceType: 'module',
    },
    rules: {
      'no-restricted-imports': noReactRouterImport,
    },
  },
];
