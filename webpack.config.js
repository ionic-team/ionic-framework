var babelOptions = {
  optional: ['es7.decorators'],
  plugins: [
    './transformers/disable-define',
    'angular2-annotations',
    'type-assertion:after'
  ]
};

module.exports = {
  entry: "./ionic/ionic",
  output: {
    path: __dirname,
    filename: "ionic.bundle.js"
  },
  module: {
    loaders: [
      { 
        test: /\.es6$/,
        loader: "babel-loader?" + JSON.stringify(babelOptions)
      },
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader?" + JSON.stringify(babelOptions)
      }
    ]
  },
  resolve: {
    alias: {
      'angular2': 'angular2/es6/dev',
      'rtts_assert': 'rtts_assert/es6'      
    },
    modulesDirectories: [
      'ionic2',
      'node_modules'
    ],
    extensions: ['', '.js', '.es6']
  }
};
