module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest"
  },
  transformIgnorePatterns: ['/node_modules/(?!ionicons|@stencil/core|@ionic/core|@ionic/vue|@ionic/vue-router)'],
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true
      }
    }
  }
};
