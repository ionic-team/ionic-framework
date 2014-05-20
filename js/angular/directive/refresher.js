
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
 * @param {string=} pulling-icon The icon to display while the user is pulling down.
 * Default: 'ion-arrow-down-c'.
 * @param {string=} pulling-text The text to display while the user is pulling down.
 * @param {string=} refreshing-icon The icon to display after user lets go of the
 * refresher.
 * @param {string=} refreshing-text The text to display after the user lets go of
 * the refresher.
 *
 */
/**
 * @ngdoc demo
 * @name ionRefresher#withAList
 * @module refresherList
 * @javascript 
 * angular.module('refresherList', ['ionic'])
 * .controller('RefresherCtrl', function($scope, $timeout) {
 *   $scope.items = ['Item 1', 'Item 2', 'Item 3'];
 *
 *   $scope.doRefresh = function() {
 *     $timeout(function() {
 *       $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
 *       $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
 *       $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
 *       $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);
 *       $scope.$broadcast('scroll.refreshComplete');
 *     }, 1000);
 *   };
 * });
 *
 * @html
 * <ion-header-bar class="bar-positive">
 *   <h1 class="title">Refresher</h1>
 * </ion-header-bar>
 * 
 * <ion-content ng-controller="RefresherCtrl">
 * 
 *   <ion-refresher on-refresh="doRefresh()" 
 *                  pulling-text="Pull to refresh..." 
 *                  refreshing-text="Refreshing!" 
 *                  refreshing-icon="ion-loading-c">
 *   </ion-refresher>
 * 
 *   <ion-list>
 *     <ion-item ng-repeat="item in items">{{item}}</ion-item>
 *   </ion-list>
 * 
 * </ion-content>
 */
IonicModule
.directive('ionRefresher', ['$ionicBind', function($ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    require: '^$ionicScroll',
    template:
    '<div class="scroll-refresher">' +
      '<div class="ionic-refresher-content" ' +
      'ng-class="{\'ionic-refresher-with-text\': pullingText || refreshingText}">' +
        '<div class="icon-pulling">' +
          '<i class="icon {{pullingIcon}}"></i>' +
        '</div>' +
        '<div class="text-pulling" ng-bind-html="pullingText"></div>' +
        '<i class="icon {{refreshingIcon}} icon-refreshing"></i>' +
        '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' +
      '</div>' +
    '</div>',
    compile: function($element, $attrs) {
      if (angular.isUndefined($attrs.pullingIcon)) {
        $attrs.$set('pullingIcon', 'ion-arrow-down-c');
      }
      if (angular.isUndefined($attrs.refreshingIcon)) {
        $attrs.$set('refreshingIcon', 'ion-loading-d');
      }
      return function($scope, $element, $attrs, scrollCtrl) {
        $ionicBind($scope, $attrs, {
          pullingIcon: '@',
          pullingText: '@',
          refreshingIcon: '@',
          refreshingText: '@',
          $onRefresh: '&onRefresh',
          $onPulling: '&onPulling'
        });

        scrollCtrl._setRefresher($scope, $element[0]);
        $scope.$on('scroll.refreshComplete', function() {
          $element[0].classList.remove('active');
          scrollCtrl.scrollView.finishPullToRefresh();
        });
      };
    }
  };
}]);
