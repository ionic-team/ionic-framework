module.exports = {
  externals: [
    {
      'ionic/ionic': {
        commonjs2: 'ionic/ionic'
      },
      '@angular/core': {
        commonjs2: ['angular2', 'core']
      },
      '@angular/common': {
        commonjs2: ['angular2', 'common']
      },
      '@angular/router' : {
        commonjs2: ['angular2', 'router']
      },
      '@angular/http': {
        commonjs2: ['angular2', 'http']
      },
      '@angular/platform-browser-dynamic': {
        commonjs2: ['angular2', 'platform', 'browser']
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
