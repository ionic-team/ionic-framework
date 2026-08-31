// @ts-check
// Angular 22 requires ESLint 9 + angular-eslint 22, which are flat-config only.
// Apps on Angular 21 and below still use the shared base/.eslintrc.json, which
// ESLint 9 ignores once this flat config is present in the build dir.
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
      // Test pages declare eager change detection on purpose: they exist to
      // prove a tick still reaches a routed page (#31406).
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
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
