module.exports = [
  {
    name: 'controller',
    transformFn: function(doc, tag) {
      return {
        path: '/docs/angularjs/api/ionic/controller/' + tag.description,
        name: tag.description
      };
    }
  },
  {
    name: 'parent',
    transformFn: function(doc, tag) {
      return {
        path: '/docs/angularjs/api/ionic/directive/' + tag.description,
        name: tag.description
      };
    }
  },
  {
    name: 'codepen'
  }
];
