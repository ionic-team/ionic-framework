module.exports = [
  {
    name: 'delegate',
    transformFn: function(doc, tag) {
      return '{@link ' + tag.description + '}';
    }
  },
  {
    name: 'parent',
    transformFn: function(doc, tag) {
      doc.parentLinks = tag.description.split(',').map(function(id) {
        return '{@link ' + id.trim() + '}';
      }).join(' or ');
      return tag.description.split(',').map(function(parent) {
        return parent.trim();
      });
    }
  },
  {
    name: 'codepen'
  },
  {
    name: 'alias'
  }
];
