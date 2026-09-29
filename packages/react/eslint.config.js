const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/*
  The shared @ionic/eslint-config is still authored in eslintrc format, so the
  previous config is bridged through FlatCompat. Everything is scoped to TS
  files to match the previous `eslint src --ext .ts` behavior and keep the
  TypeScript parser off plain JS files like this config.
*/
module.exports = [
  {
    ignores: ['dist/**', 'build/**', '**/__tests__/**', '**/react-component-lib/**'],
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
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      },
    })
    .map((config) => ({ ...config, files: ['**/*.ts', '**/*.tsx'] })),
];
