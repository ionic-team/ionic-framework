var _ = require('lodash');

module.exports = [{
  name: 'parent',
  transformFn: function(doc, tag) {
    return {
      path: 'docs/angularjs/ionic/api/directive/' + tag.description,
      name: tag.description
    };
  }
}];
