module.exports = {
  testURL: 'http://localhost/',
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor',
  },
  "testResultsProcessor": "jest-sonar-reporter"
}
