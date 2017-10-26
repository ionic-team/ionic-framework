const path = require('path');
const server = require('@stencil/dev-server/dist'); // TODO: fix after stencil-dev-server PR #16 is merged

const webdriver = require('selenium-webdriver');
const driver = new webdriver.Builder().forBrowser('chrome').build();

cmdArgs = [
  '--config', path.join(__dirname, '../stencil.config.js'),
  '--no-open'
];

(async () => {
  const devServer = await server.run(cmdArgs);
  await driver.navigate().to('http://localhost:3333/src/components/button/test/basic.html');
  driver.close();
  devServer.close();
})();

