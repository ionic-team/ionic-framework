/**
 * @private
 */
IonicModule
.factory('$ionicBind', ['$parse', '$interpolate', function($parse, $interpolate) {
  var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
  return function(scope, attrs, bindDefinition) {
    forEach(bindDefinition || {}, function (definition, scopeName) {
      //Adapted from angular.js $compile
      var match = definition.match(LOCAL_REGEXP) || [],
        attrName = match[3] || scopeName,
        mode = match[1], // @, =, or &
        parentGet,
        unwatch;

      switch(mode) {
        case '@':
          if (!attrs[attrName]) {
            return;
          }
          attrs.$observe(attrName, function(value) {
            scope[scopeName] = value;
          });
          // we trigger an interpolation to ensure
          // the value is there for use immediately
          if (attrs[attrName]) {
            scope[scopeName] = $interpolate(attrs[attrName])(scope);
          }
          break;

        case '=':
          if (!attrs[attrName]) {
            return;
          }
          unwatch = scope.$watch(attrs[attrName], function(value) {
            scope[scopeName] = value;
          });
          //Destroy parent scope watcher when this scope is destroyed
          scope.$on('$destroy', unwatch);
          break;

        case '&':
          /* jshint -W044 */
          if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '\(.*?\)'))) {
            throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' +
                          attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
          }
          parentGet = $parse(attrs[attrName]);
          scope[scopeName] = function(locals) {
            return parentGet(scope, locals);
          };
          break;
      }
    });
  };
}]);
