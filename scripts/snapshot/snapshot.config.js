
exports.config = {

  groupId: 'ionic2',
  appId: 'snapshots',
  //domain: 'localhost:8080',
  domain: 'ionic-snapshot-go.appspot.com',
  specs: 'dist/e2e/**/*e2e.js',
  //specs: 'dist/e2e/action-menu/**/*e2e.js',
  accessKey: process.env.IONIC_SNAPSHOT_KEY

};
