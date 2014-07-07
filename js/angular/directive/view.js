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
 * @param {boolean=} hide-back-button Whether to hide the back button on the parent
 * {@link ionic.directive:ionNavBar} by default.
 * @param {boolean=} hide-nav-bar Whether to hide the parent
 * {@link ionic.directive:ionNavBar} by default.
 */
IonicModule
.directive('ionView', ['$ionicViewService', '$rootScope', '$animate',
           function( $ionicViewService,   $rootScope,   $animate) {
  return {
    restrict: 'EA',
    priority: 1000,
    require: ['^?ionNavBar', '^?ionModal'],
    compile: function(tElement, tAttrs, transclude) {
      tElement.addClass('pane');
      tElement[0].removeAttribute('title');

      return function link($scope, $element, $attr, ctrls) {
        var navBarCtrl = ctrls[0];
        var modalCtrl = ctrls[1];

        //Don't use the ionView if we're inside a modal or there's no navbar
        if (!navBarCtrl || modalCtrl) {
          return;
        }

        if (angular.isDefined($attr.title)) {

          var initialTitle = $attr.title;
          navBarCtrl.changeTitle(initialTitle, $scope.$navDirection);

          // watch for changes in the title, don't set initial value as changeTitle does that
          $attr.$observe('title', function(val, oldVal) {
            navBarCtrl.setTitle(val);
          });
        }

        var hideBackAttr = angular.isDefined($attr.hideBackButton) ?
          $attr.hideBackButton :
          'false';
        $scope.$watch(hideBackAttr, function(value) {
          // Should we hide a back button when this tab is shown
          navBarCtrl.showBackButton(!value);
        });

        var hideNavAttr = angular.isDefined($attr.hideNavBar) ?
          $attr.hideNavBar :
          'false';
        $scope.$watch(hideNavAttr, function(value) {
          // Should the nav bar be hidden for this view or not?
          navBarCtrl.showBar(!value);
        });

      };
    }
  };
}]);
