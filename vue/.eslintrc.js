module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
  ],
  plugins: ['prettier', 'promise', 'jest'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  rules: {
    'no-console': 0,
    'prettier/prettier': 'error',
    'linebreak-style': ['error', 'unix'],
    'promise/no-callback-in-promise': 0,
    indent: ['error', 2],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
  },
}
