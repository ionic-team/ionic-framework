/**
 * @ngdoc directive
 * @name menuClose
 * @module ionic
 * @restrict AC
 *
 * @description
 * Attribute directive which closes a currently opened side menu. By default,
 * navigation transitions will not animate between views when the menu is open and
 * this directive is used to close the menu. Additionally, this directive
 * will reset the history and make the entering view the root of its history
 * stack. Having the entering view become the root of the history stack is done
 * to replicate the user experience seen on most side menu implementations, which is
 * to not show the back button at the root of the stack, and only show the
 * menu button. It's recommended to also use the `enable-menu-with-back-views="false"`
 * {@link ionic.directive:ionSideMenus} attribute when using the menuClose directive.
 *
 * @usage
 * Below is an example of a link within a side menu. Tapping this link would
 * automatically close the currently opened menu.
 *
 * ```html
 * <a menu-close href="#/home" class="item">Home</a>
 * ```
 */
IonicModule
.directive('menuClose', ['$ionicHistory', function($ionicHistory) {
  return {
    restrict: 'AC',
    link: function($scope, $element, $attr) {
      $element.bind('click', function() {
        var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
        if (sideMenuCtrl) {
          $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableAnimate: true,
            expire: 300
          });
          sideMenuCtrl.close();
        }
      });
    }
  };
}]);
