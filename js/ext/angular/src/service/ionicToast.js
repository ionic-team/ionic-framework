angular.module('ionic.service.toast', ['ionic.service.templateLoad', 'ionic.service.platform', 'ionic.ui.toast', 'ngAnimate'])

/**
 * @ngdoc service
 * @name $ionicToast
 * @module ionic
 * @description
 * A Toast provides simple feedback to the user.
 *
 * ![Toast](http://i.imgur.com/xF4pRpT.gif)
 *
 * @usage
 * To trigger a Toast in your code, use the $ionicToast service in you angular controllers:
 *
 * ```js
 * angular.module('mySuperApp', ['ionic'])
 * .controller(function($scope, $ionicToast) {
 *
 *  // Triggered on a button click, or some other target
 *  $scope.show = function() {
 *
 *    // Show the Toast
 *    $ionicToast.show({
 *      message: 'This is a toast',
 *      delay: 3000,
 *      position: 'bottom'
 *    });
 *
 *  };
 * });
 * ```
 *
 */
.factory('$ionicToast', ['$rootScope', '$document', '$compile', '$animate', '$timeout', '$ionicTemplateLoader', '$ionicPlatform',
function($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {

  return {
    /**
     * @ngdoc method
     * @name $ionicToast#show
     * @description
     * Display a Toast message
     *
     * A new isolated scope will be created for the
     * toast and the new element will be appended into the body.
     *
     * @param {object} opts The options for this ActionSheet. Properties:
     *
     *  - `{string}` `message` The message to be displayed in the toast.
     *  - `{number}` `delay` The time to display the toast for. Defaults to 3000ms.
     *  - `{string}` `position` The position of the toast. Can be 'top', 'middle' or 'bottom'.
     */
    show: function(opts) {
      var scope = $rootScope.$new(true);

      angular.extend(scope, opts);

      // Compile the template
      var element = $compile('<ion-toast message="message"></ion-toast>')(scope);

      // Grab the toast element for animation
      var toastEl = angular.element(element[0]);

      var hideToast = function() {
        toastEl.removeClass('toast-up');

        $animate.removeClass(element, 'active', function() {
          scope.$destroy();
        });
      };

      scope.toastClicked = function() {
        // Close the toast when it is clicked
        hideToast();
      };

      $document[0].body.appendChild(element[0]);

      var toast = new ionic.views.Toast({el: element[0] });
      scope.toast = toast;

      $animate.addClass(element, 'active');

      $timeout(function(){
        toastEl.addClass('toast-up');
      }, 20);

      $timeout(function(){
        hideToast();
      }, scope.delay || 3000);

      return toast;
    }
  };

}]);
