
exports.config = {

  groupId: 'ionic2',

  appId: 'snapshots',

  domain: 'ionic-snapshot-go.appspot.com',
  //domain: 'localhost:8080',

  sleepBetweenSpecs: 300,

  platformDefaults: {
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
