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
 * To automatically close an opened menu you can add the {@link ionic.directive:menuClose}
 * attribute directive. Including the `menu-close` attribute is usually added to
 * links and buttons within `ion-side-menu` content, so that when the element is
 * clicked then the opened side menu will automatically close.
 *
 * By default, side menus are hidden underneath its side menu content, and can be opened by
 * either swiping the content left or right, or toggling a button to show the side menu. However,
 * by adding the {@link ionic.directive:exposeAsideWhen} attribute directive to an
 * {@link ionic.directive:ionSideMenu} element directive, a side menu can be given instructions
 * on "when" the menu should be exposed (always viewable).
 *
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out:
 *
 * - {@link ionic.directive:ionSideMenuContent}
 * - {@link ionic.directive:ionSideMenu}
 * - {@link ionic.directive:menuClose}
 * - {@link ionic.directive:exposeAsideWhen}
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
.directive('ionSideMenus', ['$ionicBody', function($ionicBody) {
  return {
    restrict: 'ECA',
    controller: '$ionicSideMenus',
    compile: function(element, attr) {
      attr.$set('class', (attr['class'] || '') + ' view');

      return { pre: prelink };
      function prelink($scope) {

        $scope.$on('$ionicExposeAside', function(evt, isAsideExposed){
          if(!$scope.$exposeAside) $scope.$exposeAside = {};
          $scope.$exposeAside.active = isAsideExposed;
          $ionicBody.enableClass(isAsideExposed, 'aside-open');
        });

        $scope.$on('$destroy', function(){
          $ionicBody.removeClass('menu-open', 'aside-open');
        });

      }
    }
  };
}]);
