angular.module('ionic.service.actionSheet', ['ionic.service.templateLoad', 'ionic.service.platform', 'ionic.ui.actionSheet', 'ngAnimate'])

.factory('$ionicActionSheet', ['$rootScope', '$document', '$compile', '$animate', '$timeout',
    '$ionicTemplateLoader', '$ionicPlatform',
    function($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {

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


      // Compile the template
      var element = $compile('<ion-action-sheet buttons="buttons"></ion-action-sheet>')(scope);

      // Grab the sheet element for animation
      var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));

      var hideSheet = function(didCancel) {
        $animate.leave(sheetEl, function() {
          if(didCancel) {
            opts.cancel();
          }
        });
        
        $animate.removeClass(element, 'active', function() {
          scope.$destroy();
        });
      };

      var onHardwareBackButton = function() {
        hideSheet();
      };

      scope.$on('$destroy', function() {
        $ionicPlatform.offHardwareBackButton(onHardwareBackButton);
      });

      // Support Android back button to close
      $ionicPlatform.onHardwareBackButton(onHardwareBackButton);

      scope.cancel = function() {
        hideSheet(true);
      };

      scope.buttonClicked = function(index) {
        // Check if the button click event returned true, which means
        // we can close the action sheet
        if((opts.buttonClicked && opts.buttonClicked(index)) === true) {
          hideSheet(false);
        }
      };

      scope.destructiveButtonClicked = function() {
        // Check if the destructive button click event returned true, which means
        // we can close the action sheet
        if((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
          hideSheet(false);
        }
      };

      $document[0].body.appendChild(element[0]);

      var sheet = new ionic.views.ActionSheet({el: element[0] });
      scope.sheet = sheet;

      $animate.addClass(element, 'active');
      $animate.enter(sheetEl, element, null, function() {
      });

      return sheet;
    }
  };

}]);
