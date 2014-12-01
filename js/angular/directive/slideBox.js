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
 * Note: The slideBox will take up the whole width and height of its parent element.
 *
 * @usage
 * ```html
 * <ion-content>
 *   <ion-slide-box on-slide-changed="slideHasChanged($slideIndex)" loop="shouldLoop" auto-play="3000">
 *     <ion-slide>
 *       <div class="box blue"><h1>BLUE</h1></div>
 *     </ion-slide>
 *     <ion-slide>
 *       <div class="box yellow"><h1>YELLOW</h1></div>
 *     </ion-slide>
 *     <ion-slide>
 *       <div class="box pink"><h1>PINK</h1></div>
 *     </ion-slide>
 *   </ion-slide-box>
 * </ion-content>
 * ```
 *
 * @param {expression=} selected A model bound to the selected slide index.
 * @param {boolean=} loop Whether the slide box should loop. Default false.
 * @param {number=} auto-play If a positive number, then every time the given number of
 * milliseconds have passed, slideBox will go to the next slide. Set to a non-positive number
 * to disable. Default: -1.
 * @param {expression=} on-slide-changed Expression called when all currently queued slide
 * animations finish.  Is passed a '$slideIndex' variable.
 * @param {expression=} on-slide-start Expression called whenever a slide animation starts.
 * Is passed a '$slideIndex' variable.
 * @param {string=} delegate-handle The handle used to identify this slideBox with
 * {@link ionic.service:$ionicSlideBoxDelegate}.
 */
IonicModule
.directive('ionSlideBox', [
  '$ionicSlideBoxDelegate',
  '$ionicHistory',
  '$timeout',
function($ionicSlideBoxDelegate, $ionicHistory, $timeout) {

  return {
    restrict: 'E',
    controller: '$ionSlideBox',
    require: 'ionSlideBox',
    transclude: true,
    scope: {
      selected: '=?',
      onSlideChanged: '&',
      onSlideStart: '&'
    },
    template: '<div class="slider-slides" ng-transclude></div>',
    compile: compile
  };

  function compile(element, attr) {
    element.addClass('slider');
    // DEPRECATED attr.doesContinue
    isDefined(attr.doesContinue) && attr.$set('loop', attr.doesContinue);

    return postLink;
  }

  function postLink(scope, element, attr, slideBoxCtrl) {

    var deregister = $ionicSlideBoxDelegate._registerInstance(
      slideBoxCtrl, attr.delegateHandle, function() {
        return $ionicHistory.isActiveScope(scope);
      }
    );

    listenForSlide();
    watchSelected();
    isDefined(attr.loop) && watchLoop();
    isDefined(attr.autoPlay) && watchAutoPlay();

    scope.$on('$destroy', deregister);

    // ***
    // Methods
    // ***

    function listenForSlide() {
      element.on('$ionSlideBox.slide', function(ev, index) {
        scope.onSlideStart({
          $slideIndex: index
        });
        $timeout(angular.noop);
      });
    }

    function watchSelected() {
      scope.$watch('selected', function(index) {
        if (slideBoxCtrl.selected() !== index) {
          slideBoxCtrl.select(index);
        }
      });
    }

    function watchLoop() {
      var unwatchParent = scope.$parent.$watch(attr.loop, slideBoxCtrl.loop);
      scope.$on('$destroy', unwatchParent);
    }

    function watchAutoPlay() {
      var unwatchParent = scope.$parent.$watch(attr.autoPlay, slideBoxCtrl.autoPlay);
      scope.$on('$destroy', unwatchParent);
    }
  }

}]);


