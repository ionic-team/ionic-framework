
/**
 * @ngdoc directive
 * @name ionRefresher
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionContent, ionic.directive:ionScroll
 * @description
 * Allows you to add pull-to-refresh to a scrollView.
 *
 * Place it as the first child of your {@link ionic.directive:ionContent} or
 * {@link ionic.directive:ionScroll} element.
 *
 * When refreshing is complete, $broadcast the 'scroll.refreshComplete' event
 * from your controller.
 *
 * @usage
 *
 * ```html
 * <ion-content ng-controller="MyController">
 *   <ion-refresher
 *     pulling-text="Pull to refresh..."
 *     on-refresh="doRefresh()">
 *   </ion-refresher>
 *   <ion-list>
 *     <ion-item ng-repeat="item in items"></ion-item>
 *   </ion-list>
 * </ion-content>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $http) {
 *   $scope.items = [1,2,3];
 *   $scope.doRefresh = function() {
 *     $http.get('/new-items')
 *      .success(function(newItems) {
 *        $scope.items = newItems;
 *      })
 *      .finally(function() {
 *        // Stop the ion-refresher from spinning
 *        $scope.$broadcast('scroll.refreshComplete');
 *      });
 *   };
 * });
 * ```
 *
 * @param {expression=} on-refresh Called when the user pulls down enough and lets go
 * of the refresher.
 * @param {expression=} on-pulling Called when the user starts to pull down
 * on the refresher.
 * @param {string=} pulling-text The text to display while the user is pulling down.
 * @param {string=} pulling-icon The icon to display while the user is pulling down.
 * Default: 'ion-android-arrow-down'.
 * @param {string=} spinner The {@link ionic.directive:ionSpinner} icon to display
 * after user lets go of the refresher. The SVG {@link ionic.directive:ionSpinner}
 * is now the default, replacing rotating font icons. Set to `none` to disable both the
 * spinner and the icon.
 * @param {string=} refreshing-icon The font icon to display after user lets go of the
 * refresher. This is deprecated in favor of the SVG {@link ionic.directive:ionSpinner}.
 * @param {boolean=} disable-pulling-rotation Disables the rotation animation of the pulling
 * icon when it reaches its activated threshold. To be used with a custom `pulling-icon`.
 *
 */
IonicModule
.directive('ionRefresher', [function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['?^$ionicScroll', 'ionRefresher'],
    controller: '$ionicRefresher',
    template:
    '<div class="scroll-refresher invisible" collection-repeat-ignore>' +
      '<div class="ionic-refresher-content" ' +
      'ng-class="{\'ionic-refresher-with-text\': pullingText || refreshingText}">' +
        '<div class="icon-pulling" ng-class="{\'pulling-rotation-disabled\':disablePullingRotation}">' +
          '<i class="icon {{pullingIcon}}"></i>' +
        '</div>' +
        '<div class="text-pulling" ng-bind-html="pullingText"></div>' +
        '<div class="icon-refreshing">' +
          '<ion-spinner ng-if="showSpinner" icon="{{spinner}}"></ion-spinner>' +
          '<i ng-if="showIcon" class="icon {{refreshingIcon}}"></i>' +
        '</div>' +
        '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' +
      '</div>' +
    '</div>',
    link: function($scope, $element, $attrs, ctrls) {

      // JS Scrolling uses the scroll controller
      var scrollCtrl = ctrls[0],
          refresherCtrl = ctrls[1];
      if (!scrollCtrl || scrollCtrl.isNative()) {
        // Kick off native scrolling
        refresherCtrl.init();
      } else {
        $element[0].classList.add('js-scrolling');
        scrollCtrl._setRefresher(
          $scope,
          $element[0],
          refresherCtrl.getRefresherDomMethods()
        );

        $scope.$on('scroll.refreshComplete', function() {
          $scope.$evalAsync(function() {
            scrollCtrl.scrollView.finishPullToRefresh();
          });
        });
      }

    }
  };
}]);
