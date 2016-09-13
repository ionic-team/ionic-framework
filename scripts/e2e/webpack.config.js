var entryData = require('./webpackEntryPoints.json');
var path = require('path')

entryData["dist/e2e/vendor"] = "./scripts/e2e/vendor";
entryData["dist/e2e/polyfills"] = "./scripts/e2e/polyfills";

module.exports = {
  devtool: "source-map",

  entry: entryData,

  output: {
    "path": path.join(__dirname, '../../'),
    "filename": "[name].js"
  },

  resolve: {
    extensions: ["", ".js", ".json"],
    mainFields: ["module", "browser"]
  },

  module: {
    loaders: [
      {
        test   : /\.css$/,
        loader : 'file-loader?config=cssLoader'
      }
    ]
  },

  cssLoader: {
    name: 'test/css/[name]-[hash].[ext]'
  },
};
