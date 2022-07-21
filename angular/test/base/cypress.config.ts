import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: './e2e/**/*.spec.ts',
    baseUrl: 'http://localhost:4200/',
    excludeSpecPattern: '**/examples/*',
  },
})
