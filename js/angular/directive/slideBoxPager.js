IonicModule.directive('ionSlideBoxPager', [function() {
  return {
    restrict: 'E',
    require: '^ionSlideBox',
    scope: {},
    template:
      '<div class="slider-pager-page" ' +
           'ng-repeat="i in pages" ' +
           'ng-class="{active: i === slideBoxCtrl.shown()}" ' +
           'ng-click="slideBoxCtrl.select(i)">' +
      '</div>',
    link: postLink
  };

  function postLink(scope, element, attr, slideBoxCtrl) {
    element.addClass('slider-pager');
    scope.slideBoxCtrl = slideBoxCtrl;
    scope.pages = [];

    scope.$watch(slideBoxCtrl.count, watchCountAction);

    function watchCountAction(slidesCount) {
      scope.pages.length = slidesCount;
      for (var i = 0; i < slidesCount; i++) {
        scope.pages[i] = i;
      }
    }
  }

}]);
