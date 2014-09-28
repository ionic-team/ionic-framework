IonicModule
.directive('ionSlide', [
  SlideDirective
]);

function SlideDirective() {
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

    element.one('$animate:after', watchNgRepeatIndexOnInsertElement);
    element.on('$animate:after', refreshStateOnInsertElement);

    // If this element is inserted later by an ng-if or ng-repeat, remove it
    // from the DOM again if it's irrelevant (not selected or adjacent).
    function refreshStateOnInsertElement() {
      var slideIndex = slideBoxCtrl.indexOf(slideCtrl);
      if (!slideBoxCtrl.isRelevant(slideIndex)) {
        slideCtrl.setState('detached');
      }
    }

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
}
