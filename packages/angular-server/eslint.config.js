const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/*
  The shared @ionic/eslint-config is still authored in eslintrc format, so the
  previous config is bridged through FlatCompat. Everything is scoped to TS
  files to keep the TypeScript parser off plain JS files like this config.
*/
module.exports = [
  {
    ignores: ['dist/**'],
  },
  ...compat
    .config({
      parserOptions: {
        projectService: {
          allowDefaultProject: ['src/public_api.ts'],
        },
        tsconfigRootDir: __dirname,
      },
      extends: ['@ionic/eslint-config/recommended'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    })
    .map((config) => ({ ...config, files: ['**/*.ts'] })),
];
