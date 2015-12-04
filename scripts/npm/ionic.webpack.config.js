module.exports = {
  entry: [
    "es6-shim/es6-shim.min.js",
    "./dist/ionic.js"
  ],
  output: {
    path: 'dist/bundles',
    filename: 'ionic.js',
    libraryTarget: 'umd'
  },
  externals: [
    'angular2/angular2',
    'angular2/router',
    'angular2/http'
  ]
};
