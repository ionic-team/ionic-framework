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
    require: ['^ionSlideBox', '^^?ionSlide'],
    transclude: true,
    controller: angular.noop,
    link: postLink
  };

  function postLink(scope, element, attr, ctrls, transclude) {
    var slideBoxCtrl = ctrls[0];
    var slideCtrl = ctrls[1];

    if (slideCtrl) {
      throw new Error('You cannot have an ion-slide within another ion-slide!');
    }

    element.addClass('slider-slide');

    slideBoxCtrl.onAddSlide();

    var childScope = scope.$new();
    element.data('$ionSlideScope', childScope);

    // Disconnect by default, will be reconnected if shown
    // ionic.Utils.disconnectScope(childScope);

    transclude(childScope, function(contents) {
      element.append(contents);
    });

    scope.$on('$destroy', function() {
      slideBoxCtrl.onRemoveSlide();
      element.remove();
    });
  }
}]);
