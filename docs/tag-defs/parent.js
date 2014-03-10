var _ = require('lodash');

module.exports = [{
  name: 'parent', 
  transformFn: function(doc, tag) {
    return _.template('{@link ionic.directive:${description} ${description}}', tag);
  }
}];
