var entryData = require('./webpackEntryPoints.json');
var path = require('path');

module.exports = {
  devtool: "source-map",

  entry: entryData,

  output: {
    "path": path.join(__dirname, '../../'),
    "filename": "[name].js"
  },

  resolve: {
    extensions: ["", ".js", ".json"],
    mainFields: ["main", "browser"]
  }
};
