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
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out:
 *
 * - {@link ionic.directive:ionSideMenuContent}
 * - {@link ionic.directive:ionSideMenu}
 * - {@link ionic.directive:menuClose}
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
.directive('ionSideMenus', ['$document', function($document) {
  return {
    restrict: 'ECA',
    controller: '$ionicSideMenus',
    compile: function(element, attr) {
      attr.$set('class', (attr['class'] || '') + ' view');

      return function($scope) {
        $scope.$on('$destroy', function(){
          $document[0].body.classList.remove('menu-open');
        });

      };
    }
  };
}]);
