/**
 * @ngdoc directive
 * @name ionSideMenu
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionSideMenus
 *
 * @description
 * A container for a side menu, sibling to an {@link ionic.directive:ionSideMenuContent} directive.
 *
 * @usage
 * ```html
 * <ion-side-menu
 *   side="left"
 *   width="myWidthValue + 20"
 *   is-enabled="shouldLeftSideMenuBeEnabled()"
 *   display-type="push">
 * </ion-side-menu>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 *
 * @param {string} side Which side the side menu is currently on.  Allowed values: 'left' or 'right'.
 * @param {boolean=} is-enabled Whether this side menu is enabled.
 * @param {number=} width How many pixels wide the side menu should be.  Defaults to 275.
 * @param {string} display-type Which type of display the menu should have.  Allowed values: 'push' or 'overlay'.  Defaults to 'push'.
 */
IonicModule
.directive('ionSideMenu', function() {
  return {
    restrict: 'E',
    require: '^ionSideMenus',
    scope: true,
    compile: function(element, attr) {
      angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
      angular.isUndefined(attr.width) && attr.$set('width', '275');
      angular.isUndefined(attr.displayType) && attr.$set('displayType', 'push');

      element.addClass('menu menu-' + attr.side);
      if (attr.displayType == 'overlay') {
        element.addClass('menu-animated');
        element[0].style[attr.side] = '-' + attr.width + 'px';
        element[0].style.zIndex = 2147483647; // top most, maximum zIndex value
      }

      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side || 'left';

        var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
          width: attr.width,
          el: $element[0],
          isEnabled: true,
          displayType: attr.displayType
        });

        $scope.$watch($attr.width, function(val) {
          var numberVal = +val;
          if (numberVal && numberVal == val) {
            sideMenu.setWidth(+val);
          }
        });
        $scope.$watch($attr.isEnabled, function(val) {
          sideMenu.setIsEnabled(!!val);
        });
        $scope.$watch($attr.displayType, function(val) {
          if (val == 'push' || val == 'overlay') {
            sideMenu.setDisplayType(val);
          }
        });
      };
    }
  };
});
