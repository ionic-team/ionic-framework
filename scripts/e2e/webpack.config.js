var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var EsmLoaderPlugin = require('./EsmLoaderPlugin/EsmLoaderPlugin')
var entryData = require('./webpackEntryPoints.json');
var webpack = require('webpack');

module.exports = {
  devtool: "source-map",

  entry: entryData,

  output: {
    "path": "./",
    "filename": "[name].js",
    "publicPath": "/"
  },

  resolve: {
    extensions: ["", ".js", ".json"],
    mainFields: ["jsnext:main", "main", "browser"]
  },
  /*
  plugins: [
    new webpack.ResolverPlugin([
      new EsmLoaderPlugin({
        '@angular/common/index.js': '@angular/common/esm/index.js',
        '@angular/common/src/': '@angular/common/esm/src/',
        '@angular/compiler/index.js': '@angular/compiler/esm/index.js',
        '@angular/compiler/src/': '@angular/compiler/esm/src/',
        '@angular/compiler-cli/index.js': '@angular/compiler-cli/esm/index.js',
        '@angular/compiler-cli/src/': '@angular/compiler-cli/esm/src/',
        '@angular/core/index.js': '@angular/core/esm/index.js',
        '@angular/core/src/': '@angular/core/esm/src/',
        '@angular/forms/index.js': '@angular/forms/esm/index.js',
        '@angular/forms/src/': '@angular/forms/esm/src/',
        '@angular/http/index.js': '@angular/http/esm/index.js',
        '@angular/http/src/': '@angular/http/esm/src/',
        '@angular/platform-browser/index.js': '@angular/platform-browser/esm/index.js',
        '@angular/platform-browser/src/': '@angular/platform-browser/esm/src/',
        '@angular/platform-browser-dynamic/index.js': '@angular/platform-browser-dynamic/esm/index.js',
        '@angular/platform-browser-dynamic/src/': '@angular/platform-browser-dynamic/esm/src/'
      })
    ])
    */
    /*
    new UglifyJsPlugin({
        beautify: false, //prod
        mangle: { screw_ie8 : true }, //prod
        compress: { screw_ie8: true }, //prod
        comments: false //prod
    })
    */
  ]
};