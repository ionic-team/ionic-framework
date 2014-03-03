var pkg = require('../../package.json');

//TODO get versions from git

var version = {
  major: '0',
  minor: '9',
  dot: '26',
  codename: 'rabbit',
  full: 'Nightly',
  cdn: '0.9.26'
};

module.exports = {
  name: 'git-data',
  runBefore: ['loading-files'],
  description: 'This processor adds information from the local git repository to the extraData injectable',
  init: function(config, injectables) {
    injectables.value('gitData', {
      version: version,
      versions: [],
      info: 'git-data Information'
    });
  },
  process: function(extraData, gitData) {
    extraData.git = gitData;
  }
};
