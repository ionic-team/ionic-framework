IonicModule
.directive('ionSlideBox', [
  '$interval',
  '$ionicSlideBoxDelegate',
  SlideBoxDirective
]);

/**
 * @ngdoc directive
 * @name ionSlideBox
 * @module ionic
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slide Box is a multi-page container where each page can be swiped or dragged between:
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * @usage
 * ```html
 * <ion-slide-box on-slide-changed="slideHasChanged($index)">
 *   <ion-slide>
 *     <div class="box blue"><h1>BLUE</h1></div>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="box yellow"><h1>YELLOW</h1></div>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="box pink"><h1>PINK</h1></div>
 *   </ion-slide>
 * </ion-slide-box>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this slideBox
 * @param {expression=} selected A model bound to the selected slide index.
 * with {@link ionic.service:$ionicSlideBoxDelegate}.
 * @param {boolean=} loop Whether the slide box should loop. Default false.
 * @param {number=} auto-play If a positive number, then every time the given number of milliseconds have passed, slideBox will go to the next slide. Set to a non-positive number to disable. Default: -1.
 * @param {boolean=} show-pager Whether a pager should be shown for this slide box.
 * @param {expression=} pager-click Expression to call when a pager is clicked (if show-pager is true). Is passed the 'index' variable.
 * @param {expression=} on-slide-changed Expression called whenever the slide is changed.  Is passed an '$index' variable.
 */
function SlideBoxDirective($interval, $ionicSlideBoxDelegate) {

  return {
    restrict: 'E',
    controller: '$ionSlideBox',
    require: 'ionSlideBox',
    transclude: true,
    scope: {
      selectedIndex: '=?selected',
      onSlideChanged: '&'
    },
    template: '<div class="slider-slides" ng-transclude></div>',
    compile: compile
  };

  function compile(element, attr) {
    // DEPRECATED attr.doesContinue
    isDefined(attr.doesContinue) && attr.$set('loop', attr.doesContinue);
    // DEPRECATED attr.slideInterval
    isDefined(attr.slideInterval) && attr.$set('autoPlay', attr.slideInterval);

    return postLink;
  }

  function postLink(scope, element, attr, slideBoxCtrl) {
    element.addClass('slider');

    var deregister = $ionicSlideBoxDelegate._registerInstance(slideBoxCtrl, attr.delegateHandle);
    scope.$on('$destroy', deregister);

    isDefined(attr.loop) && watchLoop();
    isDefined(attr.selected) && watchSelected();
    isDefined(attr.autoPlay) && watchAutoPlay();

    // ***
    // Methods
    // ***

    function watchLoop() {
      var unwatchParent = scope.$parent.$watch(attr.loop, slideBoxCtrl.loop);
      scope.$on('$destroy', unwatchParent);
    }

    function watchSelected() {
      scope.$watch('selectedIndex', function selectedAttrWatchAction(newIndex) {
        if (slideBoxCtrl.isInRange(newIndex) && slideBoxCtrl.shown() !== newIndex) {
          slideBoxCtrl.select(newIndex);
        }
      });
      scope.$watch(slideBoxCtrl.shown, function shownWatchAction(newIndex) {
        scope.selectedIndex = newIndex;
        scope.onSlideChanged({
          $index: newIndex
        });
      });
    }

    var autoPlayTimeout;
    function watchAutoPlay() {
      var unwatchParent = scope.$parent.$watch(attr.autoPlay, autoPlayWatchAction);
      scope.$on('$destroy', unwatchParent);

      function autoPlayWatchAction(newDelay) {
        $interval.cancel(autoPlayTimeout);

        if (angular.isNumber(newDelay) && newDelay > 0) {
          autoPlayTimeout = $interval(function() {
            slideBoxCtrl.select(slideBoxCtrl.right());
          }, newDelay);
        }
      }
    }

  }

}

