var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var path = require("path");
var express = require("express");
//var app = express();

function clearConsole() {
  process.stdout.write('\x1bc');
}

var compiler = webpack({
  devtool: 'eval',
  entry: {
    vendor: './scripts/e2e/vendor',
    polyfills: './scripts/e2e/polyfills',
    navBasic: [
      './test/index'
    ]
  },

  output: {
    path: '/',
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['', '.js', '.json'],
    mainFields: ['main', 'browser']
  }
});

//app.use(webpackDevMiddleware(compiler, {
var app = new WebpackDevServer(compiler, {
	historyApiFallback: true,
	hot: true, // Note: only CSS is currently hot reloaded
	publicPath: '/',
	quiet: true,
	watchOptions: {
		ignored: /node_modules/
	}
});

app.listen(8080, function(err, result) {
	if (err) {
		return console.log(err);
	}

	clearConsole();
	console.log('Starting the development server...');
  console.log();
  console.log(require.resolve('./dist'));
});
