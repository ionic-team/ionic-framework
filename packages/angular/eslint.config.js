const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const angular = require('angular-eslint');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Shared @ionic/eslint-config is still authored in eslintrc format, so it is
// pulled in through FlatCompat. Everything is scoped to *.ts to match the
// previous `eslint . --ext .ts` behavior and keep the TypeScript parser off
// plain JS files like this config.
const tsConfigs = [...compat.extends('@ionic/eslint-config/recommended'), ...angular.configs.tsRecommended].map(
  (config) => ({
    ...config,
    files: ['**/*.ts'],
  })
);

module.exports = [
  {
    ignores: ['dist/**', 'build/**', 'scripts/**', '**/proxies.ts', 'test/**'],
  },
  ...tsConfigs,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        // src/ionic-core.ts and the schematics live outside the package's
        // root tsconfig program, so let the project service fall back to an
        // inferred project for them (the ts-eslint 8 equivalent of the old
        // createDefaultProgram option).
        projectService: {
          allowDefaultProject: ['lazy/src/ionic-core.ts', 'schematics/add/*.ts', 'schematics/utils/*.ts'],
        },
        tsconfigRootDir: __dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      // The proxy directives intentionally merge a class with a same-named
      // interface to surface the core component's typed inputs.
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/no-host-metadata-property': 'off',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ion',
          style: 'kebab-case',
        },
      ],
    },
  },
];
