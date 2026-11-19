const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/*
  The shared @ionic/eslint-config and the local custom-rules plugin are still
  authored in eslintrc format, so the previous config is bridged through
  FlatCompat. Configs without their own files scope are limited to TS files to
  match the previous `eslint src` behavior and keep the parser off plain JS
  files like this config.
*/
module.exports = [
  {
    ignores: [
      'dist/**',
      'src/components.d.ts',
      '**/test/**/*.spec.ts',
      '**/test/**/*.spec.tsx',
      '**/test/**/e2e.ts',
    ],
  },
  ...compat
    .config({
      env: {
        browser: true,
        es2021: true,
        node: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        '@ionic/eslint-config/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint', 'custom-rules'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^(h|Fragment)$' }],
        'no-useless-catch': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-case-declarations': 'off',
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          { allowNullableBoolean: true, allowNullableString: true, allowAny: true },
        ],
        '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
        'custom-rules/no-component-on-ready-method': 'error',
      },
      overrides: [
        {
          files: ['*.e2e.ts'],
          rules: {
            'custom-rules/await-playwright-promise-assertion': 'error',
            'custom-rules/no-playwright-to-match-snapshot-assertion': 'error',
          },
        },
      ],
    })
    .map((config) => (config.files ? config : { ...config, files: ['**/*.ts', '**/*.tsx'] })),
];
