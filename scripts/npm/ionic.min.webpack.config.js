var webpack = require('webpack');

module.exports = {
  entry: [
    "./dist/index.js"
  ],
  output: {
    path: 'dist/bundles',
    filename: 'ionic.min.js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    {
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
  plugins:[ new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    sourceMap: false
  })]
};
