var log = require('dgeni').log;
module.exports = [
  {
    name: 'delegate',
    transforms: function(doc, tag, value) {
      return '{@link ' + value + '}';
    }
  },
  {
    name: 'parent',
    transforms: function(doc, tag, value) {
      return value.split(',').map(function(id) {
        return '{@link ' + id.trim() + '}';
      }).join(' or ');
    }
  },
  { name: 'codepen' },
  { name: 'alias' }
];
