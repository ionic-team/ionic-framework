module.exports = {
  externals: [
    {
      'ionic/ionic': {
        commonjs2: 'ionic/ionic'
      },
      'angular2/core': {
        commonjs2: ['angular2', 'core']
      },
      'angular2/common': {
        commonjs2: ['angular2', 'common']
      },
      'angular2/router' : {
        commonjs2: ['angular2', 'router']
      },
      'angular2/http': {
        commonjs2: ['angular2', 'http']
      },
      'angular2/platform/browser': {
        commonjs2: ['angular2', 'platform', 'browser']
      },
      'angular2/instrumentation': {
        commonjs2: ['angular2', 'instrumentation']
      },
    }
  ],
  module: {
    loaders: [{ test: /\.ts$/, loader: "awesome-typescript-loader" }]
  },
  resolve: {
    extensions: ["", ".js", ".ts"]
  }
};
