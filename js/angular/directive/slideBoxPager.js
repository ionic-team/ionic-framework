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
    link: postLink
  };

  function postLink(scope, element, attr, slideBoxCtrl) {
    var clickFn = attr.ngClick ?
      $parse(attr.ngClick) :
      function(scope, locals) {
        slideBoxCtrl.select(locals.$slideIndex);
      };
    var node = element[0];

    // Put it outside the slides container it was transcluded into
    slideBoxCtrl.element.append(element);

    element.addClass('slider-pager');
    scope.slideBoxCtrl = slideBoxCtrl;
    scope.pages = [];

    element.on('click', onPagerClicked);
    scope.$watch(slideBoxCtrl.count, watchCountAction);
    scope.$watch(slideBoxCtrl.selected, watchSelectedAction);

    function onPagerClicked(ev) {
      for (var i = 0, pager; (pager = node.children[i]); i++) {
        if (pager === ev.target) {
          return doClick(i);
        }
      }
    }

    function watchCountAction(count, oldCount) {
      var i;
      for (i = node.children.length; i < count; i++) {
        addPager();
      }
      for (i = count; i < oldCount; i++) {
        removePager(i);
      }
    }

    function watchSelectedAction(selected, oldSelected) {
      var old = node.children[oldSelected];
      if (old) old.classList.remove('active');
      var current = node.children[selected];
      if (current) current.classList.add('active');
    }

    //* Extra methods *//

    function doClick(index) {
      scope.$apply(function() {
        clickFn(scope, {
          index: index, // DEPRECATED `index`
          $slideIndex: index,
        });
      });
    }
    function addPager() {
      var pager = document.createElement('div');
      pager.className = 'slider-pager-page';
      node.appendChild(pager);
    }
    function removePager(i) {
      var pager = node.children[i];
      pager && node.removeChild(pager);
    }
  }

}]);
