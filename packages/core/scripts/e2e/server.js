const devServer = require('@stencil/dev-server/dist');
const path = require('path');

module.exports = () => devServer.run([
  '--no-open',
  '--config',
  path.resolve(__dirname, '../../stencil.config.js')
]);
