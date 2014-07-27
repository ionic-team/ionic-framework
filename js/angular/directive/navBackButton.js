/**
 * @ngdoc directive
 * @name ionNavBackButton
 * @module ionic
 * @restrict E
 * @parent ionNavBar
 * @description
 * Creates a back button inside an {@link ionic.directive:ionNavBar}.
 *
 * Will show up when the user is able to go back in the current navigation stack.
 *
 * By default, will go back when clicked.  If you wish for more advanced behavior, see the
 * examples below.
 *
 * @usage
 *
 * With default click action:
 *
 * ```html
 * <ion-nav-bar>
 *   <ion-nav-back-button class="button-clear">
 *     <i class="ion-arrow-left-c"></i> Back
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 *
 * With custom click action, using {@link ionic.service:$ionicNavBarDelegate}:
 *
 * ```html
 * <ion-nav-bar ng-controller="MyCtrl">
 *   <ion-nav-back-button class="button-clear"
 *     ng-click="goBack()">
 *     <i class="ion-arrow-left-c"></i> Back
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.goBack = function() {
 *     $ionicNavBarDelegate.back();
 *   };
 * }
 * ```
 *
 * Displaying the previous title on the back button, again using
 * {@link ionic.service:$ionicNavBarDelegate}.
 *
 * ```html
 * <ion-nav-bar ng-controller="MyCtrl">
 *   <ion-nav-back-button class="button-icon">
 *     <i class="icon ion-arrow-left-c"></i>{% raw %}{{getPreviousTitle() || 'Back'}}{% endraw %}
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.getPreviousTitle = function() {
 *     return $ionicNavBarDelegate.getPreviousTitle();
 *   };
 * }
 * ```
 */
IonicModule
.directive('ionNavBackButton', [
  '$animate',
  '$rootScope',
  '$sanitize',
  '$ionicNavBarConfig',
  '$ionicNgClick',
function($animate, $rootScope, $sanitize, $ionicNavBarConfig, $ionicNgClick) {
  var backIsShown = false;
  //If the current viewstate does not allow a back button,
  //always hide it.
  $rootScope.$on('$viewHistory.historyChange', function(e, data) {
    backIsShown = !!data.showBack;
  });
  return {
    restrict: 'E',
    require: '^ionNavBar',
    compile: function(tElement, tAttrs) {
      tElement.addClass('button back-button ng-hide');

      var hasIconChild = !!(tElement.html() || '').match(/class=.*?ion-/);

      return function($scope, $element, $attr, navBarCtrl) {

        // Add a default back button icon based on the nav config, unless one is set
        if (!hasIconChild && $element[0].className.indexOf('ion-') === -1) {
          $element.addClass($ionicNavBarConfig.backButtonIcon);
        }

        //Default to ngClick going back, but don't override a custom one
        if (!isDefined($attr.ngClick)) {
          $ionicNgClick($scope, $element, navBarCtrl.back);
        }

        //Make sure both that a backButton is allowed in the first place,
        //and that it is shown by the current view.
        $scope.$watch(function() {
          if(isDefined($attr.fromTitle)) {
            $element[0].innerHTML = '<span class="back-button-title">' + $sanitize($scope.oldTitle) + '</span>';
          }
          return !!(backIsShown && $scope.backButtonShown);
        }, ionic.animationFrameThrottle(function(show) {
          if (show) $animate.removeClass($element, 'ng-hide');
          else $animate.addClass($element, 'ng-hide');
        }));
      };
    }
  };
}]);
