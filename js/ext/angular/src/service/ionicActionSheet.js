angular.module('ionic.service.actionSheet', ['ionic.service', 'ionic.ui.actionSheet'])

.factory('ActionSheet', ['$rootScope', '$document', '$compile', 'TemplateLoader', function($rootScope, $document, $compile, TemplateLoader) {
  return {
    /**
     * Load an action sheet with the given template string.
     *
     * A new isolated scope will be created for the 
     * action sheet and the new element will be appended into the body.
     *
     * @param {object} opts the options for this ActionSheet (see docs)
     */
    show: function(opts) {
      var scope = $rootScope.$new(true);

      angular.extend(scope, opts);

      scope.cancel = function() {
        scope.$destroy();
        opts.cancel();
      }

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index)) === true) {
          scope.$destroy();
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          scope.$destroy();
        }
      }

      // Compile the template
      var element = $compile('<action-sheet buttons="buttons"></action-sheet>')(scope);

      var scope = element.scope();

      $document[0].body.appendChild(element[0]);

      var sheet = ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;
      return sheet;
    }
  };
}]);
