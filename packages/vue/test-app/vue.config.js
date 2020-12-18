// vue.config.js
const StatsPlugin = require('stats-webpack-plugin')
module.exports = {
  chainWebpack: config => config.resolve.symlinks(false),
  configureWebpack: {
    plugins: [new StatsPlugin('../stats.json')]
  }
}
