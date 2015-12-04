module.exports = {
  entry: [
    "zone.js", // required for Angular change detection
    "reflect-metadata", // required for Angular DI
    "es6-shim/es6-shim.min.js",
    "web-animations.min",
    "./dist/ionic.js"
  ],
  output: {
    path: 'dist/bundles',
    filename: 'ionic.bundle.js',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      'web-animations.min': './dist/js/web-animations.min'
    }
  }
};
