const runServer = require('./server');
const jest = require('jest');
const path = require('path');

const jestArgs = [
  '--config',
  path.resolve(__dirname, 'jest.config.js')
].concat(process.argv.slice(2));

async function runTests() {
  const server = await runServer();
  await jest.run(jestArgs);
  await server.close();
}

runTests();
