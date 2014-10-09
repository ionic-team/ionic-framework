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
    scope.$on('$destroy', function() {
      slideBoxCtrl.remove(slideCtrl);
    });

    // Move with ng-repeat if this slide is part of ng-repeat.
    // scope.$index only appears after the first time ng-repaet inserts the element.
    function watchNgRepeatIndexOnInsertElement() {
      if (angular.isNumber(scope.$index)) {
        scope.$watch('$index', function(newIndex, oldIndex) {
          if (!isDefined(oldIndex)) return;
          var difference = newIndex - oldIndex;
          var currentIndex = slideBoxCtrl.indexOf(slideCtrl);

          slideBoxCtrl.move(slideCtrl, currentIndex + difference);
        });
      }
    }

  }
}]);
