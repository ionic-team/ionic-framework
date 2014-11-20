/**
 * @ngdoc directive
 * @name menuToggle
 * @module ionic
 * @restrict AC
 *
 * @description
 * Toggle a side menu on the given side.
 *
 * @usage
 * Below is an example of a link within a nav bar. Tapping this button
 * would open the given side menu, and tapping it again would close it.
 *
 * ```html
 * <ion-nav-bar>
 *   <ion-nav-buttons side="left">
 *    <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>
 *   </ion-nav-buttons>
 * </ion-nav-bar>
 * ```
 */
IonicModule
.directive('menuToggle', function() {
  return {
    restrict: 'AC',
    link: function($scope, $element, $attr) {
      $scope.$on('$ionicView.beforeEnter', function(ev, viewData) {
        if (viewData.enableBack) {
          var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
          if (!sideMenuCtrl.enableMenuWithBackViews()) {
            $element.addClass('hide');
          }
        } else {
          $element.removeClass('hide');
        }
      });

      $element.bind('click', function() {
        var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
        sideMenuCtrl && sideMenuCtrl.toggle($attr.menuToggle);
      });
    }
  };
});
