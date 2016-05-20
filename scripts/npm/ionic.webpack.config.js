module.exports = {
  entry: [
    "./dist/index.js"
  ],
  output: {
    path: 'dist/bundles',
    filename: 'ionic.js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    {
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
      '@angular/platform-browser': {
        commonjs2: ['angular2', 'platform', 'browser']
      },
    }
  ]
};
