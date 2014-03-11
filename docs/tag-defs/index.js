function linkify(type, id) {
  return '{@link ionic.' + type + ':' + id.trim() + '}';
}
module.exports = [
  {
    name: 'controller',
    transformFn: function(doc, tag) {
      return linkify('controller', tag.description);
    }
  },
  {
    name: 'parent',
    transformFn: function(doc, tag) {
      return tag.description.split(',').map(function(id) {
        return linkify('directive', id);
      }).join(' or ');
    }
  },
  {
    name: 'codepen'
  },
  {
    name: 'alias'
  }
];
