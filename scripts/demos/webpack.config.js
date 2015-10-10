module.exports = {
  entry: [
    "zone.js",
    "reflect-metadata",
    "angular2/angular2",
    "ionic/ionic",
    "web-animations.min",
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
        include: /\/demos\//,
        exclude: /node_modules/
       }
    ]
  },
  resolve: {
    modulesDirectories: [
      "node_modules",
      "dist/src/es5/common", // ionic-framework npm package (stable)
      "dist/js" // for web-animations polyfill
    ],
    extensions: ["", ".js", ".ts"]
  }
};
