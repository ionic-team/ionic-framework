module.exports = [
  {
    name: 'controller',
    transformFn: function(doc, tag) {
      return '{@link ionic.controller:' + tag.description.trim() + '}';
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
  },
  {
    name: 'group'
  },
  {
    name: 'groupMainItem'
  }
];
