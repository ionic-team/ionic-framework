module.exports = function(config) {
  require('./karma.conf.js')(config);
  config.set({
    singleRun: false,
  });
};


