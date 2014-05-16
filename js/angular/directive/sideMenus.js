IonicModule

/**
 * @ngdoc directive
 * @name ionSideMenus
 * @module ionic
 * @delegate ionic.service:$ionicSideMenuDelegate
 * @restrict E
 *
 * @description
 * A container element for side menu(s) and the main content. Allows the left
 * and/or right side menu to be toggled by dragging the main content area side
 * to side.
 *
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out the documenation for
 * {@link ionic.directive:ionSideMenuContent} and
 * {@link ionic.directive:ionSideMenu}.
 *
 * @usage
 * To use side menus, add an `<ion-side-menus>` parent element,
 * an `<ion-side-menu-content>` for the center content,
 * and one or more `<ion-side-menu>` directives.
 *
 * ```html
 * <ion-side-menus>
 *   <!-- Center content -->
 *   <ion-side-menu-content ng-controller="ContentController">
 *   </ion-side-menu-content>
 *
 *   <!-- Left menu -->
 *   <ion-side-menu side="left">
 *   </ion-side-menu>
 *
 *   <!-- Right menu -->
 *   <ion-side-menu side="right">
 *   </ion-side-menu>
 * </ion-side-menus>
 * ```
 * ```js
 * function ContentController($scope, $ionicSideMenuDelegate) {
 *   $scope.toggleLeft = function() {
 *     $ionicSideMenuDelegate.toggleLeft();
 *   };
 * }
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this side menu
 * with {@link ionic.service:$ionicSideMenuDelegate}.
 *
 */
/**
 * @ngdoc demo
 * @name ionSideMenus#simple
 * @module sideMenusSimple
 * @javascript
var app = angular.module('sideMenusSimple', ['ionic']);
app.controller('SideMenusSimpleCtrl', function($scope, $ionicSideMenuDelegate) {

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

});
 *
 * @html
<ion-view title="Side Menus Simple" ng-controller="SideMenusSimpleCtrl">
  <ion-side-menus>

    <ion-side-menu-content>
      <ion-header-bar class="bar-positive">
        <div class="buttons">
          <div class="button button-clear" ng-click="toggleLeft()">
            <i class="icon ion-navicon"></i>
          </div>
        </div>
      </ion-header-bar>
      <ion-content class="padding">
        <p>Slide the content or press the button on the header to open a side menu.</p>
      </ion-content>
    </ion-side-menu-content>

    <ion-side-menu side="left">
      <ion-header-bar class="bar-positive">
      </ion-header-bar>
      <ion-content>
        <a class="item" ng-click="toggleLeft()">
          Close Menu
        </a>
      </ion-content>
    </ion-side-menu>

  </ion-side-menus>
</ion-view>
 */

.directive('ionSideMenus', [function() {
  return {
    restrict: 'ECA',
    replace: true,
    transclude: true,
    controller: '$ionicSideMenus',
    template: '<div class="view" ng-transclude></div>'
  };
}]);
