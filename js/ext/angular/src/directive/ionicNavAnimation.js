(function() {
angular.module('ionic.ui.navAnimation', [])
/**
 * @ngdoc directive
 * @name ionNavAnimation
 * @module ionic
 * @restrict A
 * @parent ionic.directive:ionNavView
 *
 * @description
 * When used under an {@link ionic.directive:ionNavView} and on an `<a>` element,
 * allows you to set the animation all clicks on that link within the navView use.
 *
 * @usage
 * ```html
 * <ion-nav-view>
 *   <ion-view>
 *     <ion-content>
 *       <a href="#/some-page" ion-nav-animation="slide-in-up">
 *         Click me and #/some-page will transition in with the slide-in-up animation!
 *       </a>
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * @param {string} ion-nav-animation The animation to make the parent ionNavView change pages with when clicking this element.
 */
.directive('ionNavAnimation', function() {
  return {
    restrict: 'A',
    require: '^?ionNavView',
    link: function($scope, $element, $attrs, navViewCtrl) {
      if (!navViewCtrl) {
        return;
      }
      ionic.on('tap', function() {
        navViewCtrl.setNextAnimation($attrs.ionNavAnimation);
      }, $element[0]);
    }
  };
});
})();
