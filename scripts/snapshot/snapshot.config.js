
exports.config = {

  groupId: 'ionic2',

  appId: 'snapshots',

  domain: 'ionic-snapshot-go.appspot.com',
  //domain: 'localhost:8080',

  specs: 'dist/e2e/**/*e2e.js',
  // specs: 'dist/e2e/button/**/*e2e.js',

  sleepBetweenSpecs: 400,

  platformDefauls: {
    browser: 'chrome',
    platform: 'linux',
    params: {
      platform_id: 'chrome_400x800',
      platform_index: 0,
      platform_count: 1,
      width: 400,
      height: 800
    }
  },

  accessKey: process.env.IONIC_SNAPSHOT_KEY

};
