var path = require('path');

module.exports = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    'reflect-metadata',
    'web-animations.min',
    path.normalize('zone.js/dist/zone-microtask'),
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
      /web-animations/,
      /zone\.js(\/|\\)dist(\/|\\)zone-microtask/
    ]
  },
  resolve: {
    alias: {
      'ionic': path.normalize(process.cwd() + '/dist'),
      'web-animations.min': path.normalize(process.cwd() + '/dist/js/web-animations.min')
    },
    extensions: ["", ".js", ".ts"]
  }
};

