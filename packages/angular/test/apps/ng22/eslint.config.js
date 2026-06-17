// @ts-check
// Angular 22 requires ESLint 9 + angular-eslint 22, which are flat-config only.
// The other test apps (ng18-ng21) still use the shared base/.eslintrc.json;
// ESLint 9 ignores that file once this flat config is present in the build dir.
const angular = require('angular-eslint');

module.exports = [
  {
    ignores: ['projects/**/*'],
  },
  ...angular.configs.tsRecommended.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
    },
  },
  ...angular.configs.templateRecommended.map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'off',
    },
  },
];
