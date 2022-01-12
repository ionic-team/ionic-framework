module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest"
  },
  transformIgnorePatterns: ["node_modules/(?!@ionic/vue)", "node_modules/(?!@babel)"],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true
      }
    }
  }
};
