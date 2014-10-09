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
.directive('ionSlide', [function() {
  return {
    restrict: 'E',
    controller: '$ionSlide',
    scope: true,
    require: ['^ionSlideBox', 'ionSlide'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var slideBoxCtrl = ctrls[0];
    var slideCtrl = ctrls[1];

    element.addClass('slider-slide');

    slideBoxCtrl.add(slideCtrl);
    element.on('$destroy', function() {
      slideBoxCtrl.remove(slideCtrl);
    });

  }
}]);
