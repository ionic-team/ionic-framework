var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var path = require("path");

function clearConsole() {
  process.stdout.write('\x1bc');
}

var compiler = webpack({
  devtool: 'eval',
  entry: {
    vendor: './scripts/e2e/vendor',
    polyfills: './scripts/e2e/polyfills',
    navBasic: [
      './test/index',
      require.resolve('webpack-dev-server/client') + '?/'
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
    mainFields: ['main', 'browser'],
    'ionic-angular': './dist'
  }
});

var server = new WebpackDevServer(compiler, {
	historyApiFallback: true,
	hot: true, // Note: only CSS is currently hot reloaded
	publicPath: '/',
	quiet: true,
	watchOptions: {
		ignored: /node_modules/
	}
}).listen(8080, function(err, result) {
	if (err) {
		return console.log(err);
	}

	clearConsole();
	console.log('Starting the development server...');
	console.log();
});
