module.exports = {
  name: 'capital',
  process: function(str) {
    str || (str = '');
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
};
