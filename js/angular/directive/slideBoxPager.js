/**
 * @ngdoc directive
 * @name ionSlidePager
 * @parent ionic.directive:ionSlideBox
 * @module ionic
 * @description
 * Shows a pager for the slidebox.
 *
 * A pager is a row of small buttons at the bottom of the slidebox, each
 * representing one slide. When the user clicks a pager, that slide will
 * be selected.
 *
 * For more complete examples, see {@link ionic.directive:ionSlideBox}.
 *
 * @usage
 * This will show four pager buttons, one for each slide.
 *
 * ```html
 * <ion-slide-box>
 *   <ion-slide-pager></ion-slide-pager>
 *   <ion-slide>1</ion-slide>
 *   <ion-slide>2</ion-slide>
 *   <ion-slide>3</ion-slide>
 *   <ion-slide>4</ion-slide>
 * </ion-slide-box>
 * ```
 *
 * If you provide your own `ng-click` attribute, it overrides the default
 * click behavior.
 *
 * ```html
 * <ion-slide-box>
 *   <ion-slide-pager ng-click="doSomething($slideIndex)"></ion-slide-pager>
 *   <ion-slide>1</ion-slide>
 *   <ion-slide>2</ion-slide>
 *   <ion-slide>3</ion-slide>
 * </ion-slide-box>
 * ```
 *
 * @param {expression=} ng-click By default, clicking a pager will select the corresponding
 * slide. You can override this by providing an ng-click expression. The ng-click
 * expression will be provided a `$slideIndex` variable, signifying the slide index
 * matching the click.
 */
IonicModule.directive('ionSlidePager', [
  '$parse',
function($parse) {
  return {
    restrict: 'E',
    require: '^ionSlideBox',
    scope: {},
    template:
      '<div class="slider-pager-page" ' +
           'ng-repeat="i in pages" ' +
           'ng-class="{active: i === slideBoxCtrl.selected()}" ' +
           'ng-click="click(i)">' +
      '</div>',
    link: postLink
  };

  function postLink(scope, element, attr, slideBoxCtrl) {
    var clickFn = attr.ngClick ?
      $parse(attr.ngClick) :
      function(scope, locals) {
        slideBoxCtrl.select(locals.$slideIndex);
      };

    element.addClass('slider-pager');
    scope.slideBoxCtrl = slideBoxCtrl;
    scope.pages = [];

    scope.click = onPagerClicked;
    scope.$watch(slideBoxCtrl.count, watchCountAction);

    function onPagerClicked(index) {
      clickFn(scope.$parent, {
        // DEPRECATED pass in `index` variable
        index: index,
        $slideIndex: index,
      });
    }

    function watchCountAction(slidesCount) {
      scope.pages.length = slidesCount;
      for (var i = 0; i < slidesCount; i++) {
        scope.pages[i] = i;
      }
    }
  }

}]);
