/**
 * @ngdoc directive
 * @name ionView
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * A container for content, used to tell a parent {@link ionic.directive:ionNavBar}
 * about the current view.
 *
 * @usage
 * Below is an example where our page will load with a navbar containing "My Page" as the title.
 *
 * ```html
 * <ion-nav-bar></ion-nav-bar>
 * <ion-nav-view class="slide-left-right">
 *   <ion-view title="My Page">
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * @param {string=} title The title to display on the parent {@link ionic.directive:ionNavBar}.
 * @param {boolean=} hideBackButton Whether to hide the back button on the parent
 * {@link ionic.directive:ionNavBar} by default.
 * @param {boolean=} hideNavBar Whether to hide the parent
 * {@link ionic.directive:ionNavBar} by default.
 */
IonicModule
.directive('ionView', ['$ionicViewService', '$rootScope', '$animate',
           function( $ionicViewService,   $rootScope,   $animate) {
  return {
    restrict: 'EA',
    priority: 1000,
    require: '^?ionNavBar',
    compile: function(tElement, tAttrs, transclude) {
      tElement.addClass('pane');
      tElement[0].removeAttribute('title');

      return function link($scope, $element, $attr, navBarCtrl) {
        if (!navBarCtrl) {
          return;
        }

        if (angular.isDefined($attr.title)) {

          var initialTitle = $attr.title;
          navBarCtrl.changeTitle(initialTitle, $scope.$navDirection);

          // watch for changes in the title, don't set initial value as changeTitle does that
          $attr.$observe('title', function(val, oldVal) {
            if (val !== initialTitle) {
              navBarCtrl.setTitle(val);
            }
          });

        }

        $scope.$watch($attr.hideBackButton, function(value) {
          // Should we hide a back button when this tab is shown
          navBarCtrl.showBackButton(!value);
        });

        $scope.$watch($attr.hideNavBar, function(value) {
          // Should the nav bar be hidden for this view or not?
          navBarCtrl.showBar(!value);
        });

      };
    }
  };
}]);
