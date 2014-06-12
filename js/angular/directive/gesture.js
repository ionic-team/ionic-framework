

IonicModule

/**
 * @ngdoc directive
 * @name onHold
 * @module ionic
 * @restrict A
 *
 * @description
 * Touch stays at the same location for 500ms.
 *
 * @usage
 * ```html
 * <button on-hold="onHold()" class="button">Test</button>
 * ```
 */
  .directive('onHold', gestureDirective('onHold'))


/**
 * @ngdoc directive
 * @name onTap
 * @module ionic
 * @restrict A
 *
 * @description
 * Quick touch at a location. If the duration of the touch goes
 * longer than 250ms it is no longer a tap gesture.
 *
 * @usage
 * ```html
 * <button on-tap="onTap()" class="button">Test</button>
 * ```
 */
  .directive('onTap', gestureDirective('onTap'))


/**
 * @ngdoc directive
 * @name onTouch
 * @module ionic
 * @restrict A
 *
 * @description
 * Called immediately when the user first begins a touch. This
 * gesture does not wait for a touchend/mouseup.
 *
 * @usage
 * ```html
 * <button on-touch="onTouch()" class="button">Test</button>
 * ```
 */
  .directive('onTouch', gestureDirective('onTouch'))


/**
 * @ngdoc directive
 * @name onRelease
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the user ends a touch.
 *
 * @usage
 * ```html
 * <button on-release="onRelease()" class="button">Test</button>
 * ```
 */
  .directive('onRelease', gestureDirective('onRelease'))


/**
 * @ngdoc directive
 * @name onDrag
 * @module ionic
 * @restrict A
 *
 * @description
 * Move with one touch around on the page. Blocking the scrolling when
 * moving left and right is a good practice. When all the drag events are
 * blocking you disable scrolling on that area.
 *
 * @usage
 * ```html
 * <button on-drag="onDrag()" class="button">Test</button>
 * ```
 */
  .directive('onDrag', gestureDirective('onDrag'))


/**
 * @ngdoc directive
 * @name onDragUp
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged up.
 *
 * @usage
 * ```html
 * <button on-drag-up="onDragUp()" class="button">Test</button>
 * ```
 */
  .directive('onDragUp', gestureDirective('onDragUp'))


/**
 * @ngdoc directive
 * @name onDragRight
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged to the right.
 *
 * @usage
 * ```html
 * <button on-drag-right="onDragRight()" class="button">Test</button>
 * ```
 */
  .directive('onDragRight', gestureDirective('onDragRight'))


/**
 * @ngdoc directive
 * @name onDragDown
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged down.
 *
 * @usage
 * ```html
 * <button on-drag-down="onDragDown()" class="button">Test</button>
 * ```
 */
  .directive('onDragDown', gestureDirective('onDragDown'))


/**
 * @ngdoc directive
 * @name onDragLeft
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when the element is dragged to the left.
 *
 * @usage
 * ```html
 * <button on-drag-left="onDragLeft()" class="button">Test</button>
 * ```
 */
  .directive('onDragLeft', gestureDirective('onDragLeft'))


/**
 * @ngdoc directive
 * @name onSwipe
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity in any direction.
 *
 * @usage
 * ```html
 * <button on-swipe="onSwipe()" class="button">Test</button>
 * ```
 */
  .directive('onSwipe', gestureDirective('onSwipe'))


/**
 * @ngdoc directive
 * @name onSwipeUp
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving up.
 *
 * @usage
 * ```html
 * <button on-swipe-up="onSwipeUp()" class="button">Test</button>
 * ```
 */
  .directive('onSwipeUp', gestureDirective('onSwipeUp'))


/**
 * @ngdoc directive
 * @name onSwipeRight
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving to the right.
 *
 * @usage
 * ```html
 * <button on-swipe-right="onSwipeRight()" class="button">Test</button>
 * ```
 */
  .directive('onSwipeRight', gestureDirective('onSwipeRight'))


/**
 * @ngdoc directive
 * @name onSwipeDown
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving down.
 *
 * @usage
 * ```html
 * <button on-swipe-down="onSwipeDown()" class="button">Test</button>
 * ```
 */
  .directive('onSwipeDown', gestureDirective('onSwipeDown'))


/**
 * @ngdoc directive
 * @name onSwipeLeft
 * @module ionic
 * @restrict A
 *
 * @description
 * Called when a moving touch has a high velocity moving to the left.
 *
 * @usage
 * ```html
 * <button on-swipe-left="onSwipeLeft()" class="button">Test</button>
 * ```
 */
  .directive('onSwipeLeft', gestureDirective('onSwipeLeft'));



function gestureDirective(attrName) {
  return ['$ionicGesture', function($ionicGesture) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var eventType = attrName.substr(2).toLowerCase();

        var listener = function(ev) {
          $scope.$apply( $attr[attrName] );
        };

        var gesture = $ionicGesture.on(eventType, listener, $element);

        $scope.$on('$destroy', function() {
          $ionicGesture.off(gesture, eventType, listener);
        });

      }
    };
  }];
}
