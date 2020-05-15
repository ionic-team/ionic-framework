module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@ionic'],
  extends: ['plugin:@ionic/strict'],
  rules: {
    "no-conditional-assignment": 0,
    "no-non-null-assertion": 0,
    "no-unnecessary-type-assertion": 0,
    "no-import-side-effect": 0,
    "trailing-comma": 0,
    "no-null-keyword": 0,
    "no-console": 0,
    "no-floating-promises": 0,

    "jsx-key": 0,
    "jsx-self-close": 0,
    "jsx-no-bind": 0,
    "jsx-no-lambda": 0,
    "jsx-no-multiline-js": 0,
    "jsx-wrap-multiline": 0
  }
};
