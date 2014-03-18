module.exports = [
  {
    name: 'controller',
    transformFn: function(doc, tag) {
      var desc = tag.description.trim();
      var id = desc.split(' ')[0];
      var other = desc.split(' ').splice(1).join(' ');

      var link = '{@link ionic.controller:' + id + '}';
      return link + (other ? ' ' + other : '');
    }
  },
  {
    name: 'controllerBind',
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
