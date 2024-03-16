module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "@ionic/eslint-config/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint",
    "custom-rules"
  ],
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "varsIgnorePattern": "^h$"
      }
    ],
    "no-useless-catch": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        "allowNullableBoolean": true,
        "allowNullableString": true,
        "allowAny": true
      }
    ],
    "custom-rules/no-component-on-ready-method": "error"
  },
  "overrides": [
    {
      "files": ["*.e2e.ts"],
      "rules": {
        "custom-rules/await-playwright-promise-assertion": "error",
        "custom-rules/no-playwright-to-match-snapshot-assertion": "error"
      }
    }
  ]
};
