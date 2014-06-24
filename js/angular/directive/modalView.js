/**
 * @ngdoc directive
 * @name ionModalView
 * @module ionic
 * @restrict EA
 *
 * @description
 * A container for content, used as a modal view.
 *
 * @usage
 * Below is an example where our modal page will load.
 *
 * ```html
 * <ion-modal-view>
 *   <ion-content>
 *     Hello!
 *   </ion-content>
 * </ion-modal-view>
 * ```
 */
IonicModule
.directive('ionModalView', [function() {
  return {
    restrict: 'EA',
    priority: 1000,
    compile: function(tElement, tAttrs, transclude) {
      tElement.addClass('modal');
    }
  };
}]);