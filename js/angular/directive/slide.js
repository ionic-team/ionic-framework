/**
 * @ngdoc directive
 * @name ionSlide
 * @parent ionic.directive:ionSlideBox
 * @module ionic
 *
 * @description
 * Displays a slide inside of a slidebox.
 *
 * For more complete examples, see {@link ionic.directive:ionSlideBox}.
 *
 * @usage
 * ```html
 * <ion-slide-box>
 *   <ion-slide>1</ion-slide>
 *   <ion-slide>2</ion-slide>
 * </ion-slide-box>
 * ```
 */
IonicModule
.directive('ionSlide', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    controller: '$ionSlide',
    require: '^ionSlideBox',
    scope: true,
    link: postLink
  };

  function postLink(scope, element, attr, slideBoxCtrl) {
    element.addClass('slider-slide');

    $timeout(angular.noop);
    element.on('$destroy', function() {
      $timeout(angular.noop);
    });
  }
}]);
