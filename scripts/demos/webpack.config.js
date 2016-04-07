var path = require('path');

module.exports = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    'reflect-metadata',
    path.normalize('zone.js/dist/zone'),
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
        query: {
          'doTypeCheck': false
        },
        include: /\/demos\//,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/angular2'),
        loader: 'strip-sourcemap'
      }
    ],
    noParse: [
      /es6-shim/,
      /reflect-metadata/,
      /zone\.js(\/|\\)dist(\/|\\)zone-microtask/
    ]
  },
  resolve: {
    alias: {
      'ionic-angular': path.normalize(process.cwd() + '/dist')
    },
    extensions: ["", ".js", ".ts"]
  }
};
