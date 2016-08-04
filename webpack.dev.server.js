var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var path = require("path");
var express = require("express");
var webpackServerConfig = require('./webpackServerConfig.json');

function clearConsole() {
  process.stdout.write('\x1bc');
}

var compiler = webpack(webpackServerConfig);
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
