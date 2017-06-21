module.exports = {
  name: 'platform',
  process: function (str) {
    switch (str) {
      case 'ios':
        return 'iOS'
      case 'md':
        return 'Material Design'
      case 'wp':
        return 'Windows Platform'
      default:
        return 'All'
    }
  }
};
